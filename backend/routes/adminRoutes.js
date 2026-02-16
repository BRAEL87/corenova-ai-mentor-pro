const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Course = require('../models/Course');
const User = require('../models/User');
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');
const { sendMessage } = require('../services/whatsappService');

// @desc    Auth admin & get token
// @route   POST /api/admin/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Login attempt for: ${email}`);

        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                email: admin.email,
                token: jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
                    expiresIn: '30d',
                }),
            });
        } else {
            console.log('Invalid credentials');
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
});

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
router.get('/stats', protect, async (req, res) => {
    const totalStudents = await User.countDocuments();
    const activeToday = await User.countDocuments({
        updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    const lessonsCompleted = await User.aggregate([
        { $project: { progressCount: { $size: "$progress" } } },
        { $group: { _id: null, total: { $sum: "$progressCount" } } }
    ]);
    const messagesSent = await Message.countDocuments({ role: 'assistant' });

    res.json({
        totalStudents,
        activeToday,
        lessonsCompleted: lessonsCompleted[0]?.total || 0,
        messagesSent
    });
});

// @desc    Get all students
// @route   GET /api/admin/students
router.get('/students', protect, async (req, res) => {
    const students = await User.find({}).sort({ createdAt: -1 });
    res.json(students);
});

// @desc    Get courses
// @route   GET /api/admin/courses
router.get('/courses', protect, async (req, res) => {
    const courses = await Course.find({});
    res.json(courses);
});

// @desc    Create/Update course
// @route   POST /api/admin/courses
router.post('/courses', protect, async (req, res) => {
    const { id, name, systemPrompt, welcomeMessage } = req.body;

    if (id) {
        const course = await Course.findByIdAndUpdate(id, { name, systemPrompt, welcomeMessage }, { new: true });
        res.json(course);
    } else {
        const course = await Course.create({ name, systemPrompt, welcomeMessage });
        res.status(201).json(course);
    }
});

// @desc    Enroll student & Start Teaching
// @route   POST /api/admin/send-welcome
router.post('/send-welcome', protect, async (req, res) => {
    const { userId, courseId } = req.body;

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
        return res.status(404).json({ message: 'User or Course not found' });
    }

    // Update user's current course
    user.currentModule = course.name;
    user.currentLessonIndex = 0;
    await user.save();

    // Send Welcome Message via WhatsApp
    await sendMessage(user.phoneNumber, course.welcomeMessage);

    // Save AI Response in History
    await Message.create({
        userId: user._id,
        role: 'assistant',
        content: course.welcomeMessage
    });

    res.json({ message: 'Course started and message sent!' });
});

module.exports = router;
