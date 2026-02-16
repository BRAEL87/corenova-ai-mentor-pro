const mongoose = require('mongoose');

const memorySchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    embedding: {
        type: [Number],
        required: true,
        index: '2dsphere', // Basic indexing, though standard MongoDB Vector Search handles this differently
    },
    type: {
        type: String,
        enum: ['user', 'ai', 'lesson'],
        default: 'user',
    },
}, {
    timestamps: true,
});

const Memory = mongoose.model('Memory', memorySchema);

module.exports = Memory;
