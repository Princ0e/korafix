const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({}).select('name email role');
        console.log(`Found ${users.length} users:`);
        
        users.forEach(user => {
            console.log(`- ${user.name} (${user.email}) - ID: ${user._id} - Role: ${user.role}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error listing users:', error);
        process.exit(1);
    }
};

listUsers();
