const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const User = require('./models/User');
const Category = require('./models/Category');

dotenv.config();

const listJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const jobs = await Job.find({}).populate('client', 'name email').populate('category', 'name');
        console.log(`Found ${jobs.length} jobs:`);
        
        jobs.forEach(job => {
            console.log('---');
            console.log(`ID: ${job._id}`);
            console.log(`Title: ${job.title}`);
            console.log(`Client: ${job.client ? job.client.name : 'NULL'}`);
            console.log(`Category: ${job.category ? job.category.name : 'NULL'}`);
            console.log(`Status: ${job.status}`);
            console.log(`Created At: ${job.createdAt}`);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error listing jobs:', error);
        process.exit(1);
    }
};

listJobs();
