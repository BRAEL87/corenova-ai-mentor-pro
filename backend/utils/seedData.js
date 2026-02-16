const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const Course = require('../models/Course');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        await Admin.deleteMany();
        await Course.deleteMany();

        // Admin
        await Admin.create({
            email: 'admin@corenova.com',
            password: 'adminpassword',
        });

        // Sample Course
        await Course.create({
            name: 'Intro to Python',
            systemPrompt: `You are CoreNova AI Mentor Pro, an elite Python instructor. 
Focus on hands-on coding. 
If the user is a beginner, use simple analogies.
Always encourage them.`,
            welcomeMessage: `Hey there! 🚀 I'm your AI Mentor. Ready to learn Python? Let's start with Lesson 1: Variables. Type 'START' when you're ready!`,
        });

        console.log('Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
