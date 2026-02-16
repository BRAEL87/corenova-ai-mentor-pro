const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    role: {
        type: String, // 'user' or 'assistant' or 'system'
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    messageType: {
        type: String, // 'text', 'audio', 'image'
        default: 'text',
    },
    metadata: {
        type: Object, // Store lessonId, moduleID if relevant
        default: {},
    },
}, {
    timestamps: true,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
