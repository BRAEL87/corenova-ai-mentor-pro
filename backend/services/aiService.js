const OpenAI = require('openai');
const fs = require('fs');

const openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
        "HTTP-Referer": "https://corenova.ai",
        "X-Title": "CoreNova AI Mentor Pro",
    },
});

const generateResponse = async (history, systemPrompt) => {
    try {
        const messages = [
            { role: 'system', content: systemPrompt },
            ...history,
        ];

        const completion = await openai.chat.completions.create({
            model: 'openai/gpt-4o-mini', // OpenRouter specific model ID
            messages: messages,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error generating AI response:', error);
        return "I'm having trouble processing that right now. Please try again.";
    }
};

const transcribeAudio = async (filePath) => {
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: fs.createReadStream(filePath),
            model: 'whisper-1',
        });

        return transcription.text;
    } catch (error) {
        console.error('Error transcribing audio:', error);
        return null;
    }
};

const getEmbedding = async (text) => {
    try {
        const response = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: text,
            encoding_format: "float",
        });
        return response.data[0].embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        return [];
    }
}

module.exports = {
    generateResponse,
    transcribeAudio,
    getEmbedding
};
