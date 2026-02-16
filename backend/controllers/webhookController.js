const { sendMessage, markAsRead } = require('../services/whatsappService');
const { generateResponse, transcribeAudio, getEmbedding } = require('../services/aiService');
const User = require('../models/User');
const Message = require('../models/Message');
const Course = require('../models/Course');

// Verify Webhook (GET)
const verifyWebhook = (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
};

// Receive Message (POST)
const receiveMessage = async (req, res) => {
    const body = req.body;

    if (body.object) {
        if (
            body.entry &&
            body.entry[0].changes &&
            body.entry[0].changes[0].value.messages &&
            body.entry[0].changes[0].value.messages[0]
        ) {
            const message = body.entry[0].changes[0].value.messages[0];
            const from = message.from;
            const messageId = message.id;
            const messageType = message.type;

            // Mark as read immediately
            await markAsRead(messageId);

            try {
                // Find or create user
                let user = await User.findOne({ phoneNumber: from });
                if (!user) {
                    user = await User.create({
                        phoneNumber: from,
                        name: body.entry[0].changes[0].value.contacts[0].profile.name || "Student",
                        currentModule: 'intro-to-python',
                        currentLessonIndex: 0
                    });
                }

                let userMessageContent = '';
                if (messageType === 'text') {
                    userMessageContent = message.text.body;
                } else if (messageType === 'audio') {
                    // Placeholder for audio transcription
                    userMessageContent = "[Audio Message]";
                }

                console.log(`Received from ${user.name}: ${userMessageContent}`);

                // Save User Message
                await Message.create({
                    userId: user._id,
                    role: 'user',
                    content: userMessageContent,
                    messageType: messageType
                });

                // --- RAG & AI Logic ---

                // 1. Retrieve relevant context (Last 10 messages)
                const recentMessages = await Message.find({ userId: user._id })
                    .sort({ createdAt: -1 })
                    .limit(10);

                const history = recentMessages.reverse().map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: msg.content
                }));

                // 2. System Prompt Construction
                const course = await Course.findOne({ name: user.currentModule }) || { systemPrompt: 'You are CoreNova AI Mentor Pro.' };

                const systemPrompt = `${course.systemPrompt}
        Current Student: ${user.name}
        Current Module: ${user.currentModule}
        Lesson Index: ${user.currentLessonIndex}
        
        Keep responses concise (under 160 chars preferred, max 300).`;

                // 3. Generate AI Response
                let responseText = '';
                const upperMsg = userMessageContent.toUpperCase().trim();

                if (upperMsg === 'START') {
                    responseText = `Welcome ${user.name}! I am CoreNova AI Mentor Pro. We are starting 'Introduction to Python'. 
            
Lesson 1: Variables.
Variables are containers for storing data values.
Example:
x = 5
y = "Hello"

Type 'NEXT' for the next concept or ask a question.`;
                } else if (upperMsg === 'PROGRESS') {
                    responseText = `Student: ${user.name}\nModule: ${user.currentModule}\nScore: N/A`;
                } else if (upperMsg === 'HELP') {
                    responseText = `Commands:\nSTART - Begin Course\nQUIZ - Take a Quiz\nPROGRESS - Check Stats`;
                } else {
                    responseText = await generateResponse(history, systemPrompt);
                }

                // 4. Send Response
                await sendMessage(from, responseText);

                // 5. Save AI Response
                await Message.create({
                    userId: user._id,
                    role: 'assistant',
                    content: responseText
                });

            } catch (error) {
                console.error('Error processing message:', error);
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
};

module.exports = {
    verifyWebhook,
    receiveMessage,
};
