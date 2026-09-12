const Job = require('../models/Job');
const Category = require('../models/Category');
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

const getCategoryKeywords = (category) => {
    if (!category) return [];
    const c = category.toLowerCase().trim();
    if (c.includes('educat') || c.includes('teach') || c.includes('uburezi') || c.includes('ecole') || c.includes('école')) {
        return ['teacher', 'primary teacher', 'teach', 'tutor', 'education', 'school', 'music teacher', 'french', 'math'];
    }
    if (c.includes('web') || c.includes('tech') || c.includes('develop') || c.includes('design') || c.includes('ikoranabuhanga') || c.includes('software')) {
        return ['web', 'designer', 'developer', 'software', 'frontend', 'backend', 'code', 'technical', 'programmer'];
    }
    if (c.includes('driver') || c.includes('transport') || c.includes('taxi') || c.includes('cab') || c.includes('shoferi') || c.includes('chauffeur')) {
        return ['driver', 'cab', 'taxi', 'transport', 'driving', 'chauffeur', 'car'];
    }
    if (c.includes('home') || c.includes('rugo') || c.includes('domicile') || c.includes('house') || c.includes('clean') || c.includes('helper')) {
        return ['home', 'house', 'helper', 'cleaning', 'housekeeper', 'maid'];
    }
    if (c.includes('plumb') || c.includes('amazi')) {
        return ['plumber', 'pipe', 'leak', 'bathroom', 'kitchen'];
    }
    if (c.includes('electr') || c.includes('amashanyarazi')) {
        return ['electrician', 'wiring', 'electrical'];
    }
    if (c.includes('mechanic') || c.includes('auto') || c.includes('mecanic') || c.includes('umukanishi')) {
        return ['mechanic', 'car repair', 'engine', 'auto', 'diagnostics'];
    }
    if (c.includes('creative') || c.includes('graphic') || c.includes('ubuhanzi')) {
        return ['graphic', 'designer', 'design', 'logo', 'creative', 'branding'];
    }
    if (c.includes('construct') || c.includes('ubwubatsi') || c.includes('carpenter') || c.includes('painter') || c.includes('umubaji')) {
        return ['construction', 'carpenter', 'painter', 'builder', 'woodworking'];
    }
    if (c.includes('office') || c.includes('ibiro') || c.includes('bureau') || c.includes('admin')) {
        return ['admin', 'assistant', 'office', 'secretary', 'data entry'];
    }
    if (c.includes('health') || c.includes('ubuzima') || c.includes('sante') || c.includes('santé')) {
        return ['health', 'nurse', 'doctor', 'care', 'medical'];
    }
    return [c];
};

// @desc    Get all jobs (with optional title, location & category filtering)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    try {
        const { title, location, category } = req.query;
        let query = { status: 'Open' };

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Smart category matching: matches category doc, group, or job title/description keywords
        if (category) {
            const keywords = getCategoryKeywords(category);
            const searchTerms = [category, ...keywords];
            const regexTerms = searchTerms.map(term => new RegExp(term, 'i'));

            const matchedCategories = await Category.find({
                $or: [
                    { name: { $in: regexTerms } },
                    { group: { $in: regexTerms } }
                ]
            }).select('_id');
            const categoryIds = matchedCategories.map(c => c._id);

            const matchConditions = [];
            if (categoryIds.length > 0) {
                matchConditions.push({ category: { $in: categoryIds } });
            }
            regexTerms.forEach(reg => {
                matchConditions.push({ title: { $regex: reg } });
                matchConditions.push({ description: { $regex: reg } });
            });

            if (matchConditions.length > 0) {
                query.$or = matchConditions;
            }
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

