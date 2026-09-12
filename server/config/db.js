const mongoose = require('mongoose');
const { syncCategoriesAndJobs } = require('./syncData');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    // Sync categories and ensure jobs have correct categories assigned
    await syncCategoriesAndJobs();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

