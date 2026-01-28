const Job = require('../models/Job');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Client only)
const createJob = async (req, res) => {
    const { title, description, category, location, budget, phone } = req.body;

    const job = new Job({
        client: req.user._id,
        title,
        description,
        category,
        location,
        budget,
        phone,
        status: 'Open'
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    // Simple filtering can be added here
    const jobs = await Job.find({ status: 'Open' }).populate('client', 'name').populate('category', 'name');
    res.json(jobs);
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    const job = await Job.findById(req.params.id).populate('client', 'name email').populate('category');

    if (job) {
        res.json(job);
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};

module.exports = { createJob, getJobs, getJobById };
