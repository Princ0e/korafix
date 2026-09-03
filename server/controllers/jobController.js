const Job = require('../models/Job');
const { sendAdminNotificationEmail } = require('../utils/sendEmail');

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

// @desc    Get all jobs (with optional title & location filtering)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const { title, location } = req.query;
        let query = { status: 'Open' };

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Hide client/job phone from public/employee/employer listings
        const jobs = await Job.find(query)
            .populate('client', 'name')
            .populate('category', 'name')
            .select('-phone');
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
        const job = await Job.findById(req.params.id)
            .populate('client', 'name email')
            .populate('category')
            .select('-phone');

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

// @desc    Apply for a job (supports both logged-in workers and guest applicants)
// @route   POST /api/jobs/:id/apply
// @access  Public / Private
const applyForJob = async (req, res) => {
    try {
        const { name, phone, skills } = req.body;
        const job = await Job.findById(req.params.id).populate('client', 'name email phone');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        if (job.status !== 'Open') {
            return res.status(400).json({ message: 'This job is no longer accepting applications' });
        }

        const applicantName = name || (req.user ? req.user.name : '');
        const applicantPhone = phone || (req.user ? (req.user.phone || req.user.socialLinks?.whatsapp) : '');
        const applicantSkills = skills || (req.user ? (Array.isArray(req.user.skills) ? req.user.skills.join(', ') : req.user.bio) : '');

        if (!applicantName || !applicantPhone) {
            return res.status(400).json({ message: 'Please provide your name and phone number.' });
        }

        // Check if applicant already applied (by user ID if logged in, or by phone if guest)
        const alreadyApplied = job.applicants?.some(applicant => {
            if (req.user && applicant.worker && applicant.worker.toString() === req.user._id.toString()) {
                return true;
            }
            if (applicant.phone && applicant.phone === applicantPhone) {
                return true;
            }
            return false;
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: 'You have already applied for this job.' });
        }

        if (!job.applicants) job.applicants = [];
        job.applicants.push({
            worker: req.user ? req.user._id : undefined,
            name: applicantName,
            phone: applicantPhone,
            skills: applicantSkills,
            message: applicantSkills,
            createdAt: new Date()
        });

        await job.save();

        // Send notification email to admin (qickfixer70@gmail.com)
        await sendAdminNotificationEmail({
            job,
            worker: {
                name: applicantName,
                phone: applicantPhone,
                email: req.user?.email || 'Guest Applicant',
                skills: applicantSkills
            },
            client: job.client
        });

        res.status(200).json({
            message: 'Application sent successfully! Admin will connect you with the employer.',
            jobId: job._id
        });
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ message: error.message || 'Server error while applying for job' });
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

module.exports = { createJob, getJobs, getJobById, applyForJob, getJobFilters };

