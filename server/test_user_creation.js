const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const testUserCreation = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const userData = {
            name: 'Test User',
            email: 'test' + Date.now() + '@example.com',
            password: 'password123',
            role: 'client'
        };

        console.log('Attempting to create user:', userData);
        const user = await User.create(userData);
        console.log('User created successfully:', user._id);
        
        process.exit(0);
    } catch (error) {
        console.error('Error creating user:');
        console.error(error);
        process.exit(1);
    }
};

testUserCreation();
