const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    currentModule: {
        type: String, // e.g., 'intro-to-python'
        default: 'intro-to-python',
    },
    currentLessonIndex: {
        type: Number,
        default: 0,
    },
    progress: [
        {
            moduleId: String,
            lessonId: String,
            score: Number,
            completedAt: Date,
        },
    ],
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
