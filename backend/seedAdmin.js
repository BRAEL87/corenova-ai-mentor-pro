const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        const adminExists = await Admin.findOne({ email: 'admin@corenova.ai' });

        if (!adminExists) {
            await Admin.create({
                email: 'admin@corenova.ai',
                password: 'password123'
            });
            console.log('Admin account created successfully!');
            console.log('Email: admin@corenova.ai');
            console.log('Password: password123');
        } else {
            console.log('Admin account already exists.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
