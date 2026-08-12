const Job = require('../models/Job');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Client only)
const createJob = async (req, res) => {
    try {
        const { title, description, category, location, budget, phone } = req.body;

        const job = new Job({
            client: req.user?._id,
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
    } catch (error) {
        console.error('Error creating job:', error);
        console.log('Request body:', req.body);
        console.log('User ID:', req.user?._id);
        res.status(400).json({
            message: error.message || 'Failed to create job',
            details: error.errors // This reveals specific Mongoose validation errors
        });
    }
};

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        // Simple filtering can be added here
        const jobs = await Job.find({ status: 'Open' }).populate('client', 'name').populate('category', 'name');
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('client', 'name email').populate('category');

        if (job) {
            res.json(job);
        } else {
            res.status(404).json({ message: 'Job not found' });
        }
    } catch (error) {
        console.error('Error fetching job by ID:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get unique job titles and locations for filters
// @route   GET /api/jobs/filters
// @access  Public
const getJobFilters = async (req, res) => {
    try {
        const titles = await Job.distinct('title', { status: 'Open' });
        const locations = await Job.distinct('location', { status: 'Open' });
        res.json({ titles, locations });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createJob, getJobs, getJobById, getJobFilters };
