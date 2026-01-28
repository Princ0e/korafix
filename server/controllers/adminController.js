const User = require('../models/User');
const Job = require('../models/Job');

// @desc    Get all users with role 'worker'
// @route   GET /api/admin/job-seekers
// @access  Private/Admin
const getJobSeekers = async (req, res) => {
    try {
        const workers = await User.find({ role: 'worker' }).select('-password');
        res.json(workers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all jobs (service requests) with client details
// @route   GET /api/admin/service-seekers
// @access  Private/Admin
const getServiceSeekers = async (req, res) => {
    try {
        const jobs = await Job.find({}).populate('client', 'name email phone');
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getJobSeekers,
    getServiceSeekers
};
