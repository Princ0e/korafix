const HireRequest = require('../models/HireRequest');
const User = require('../models/User');

// @desc    Send a hire request to a worker
// @route   POST /api/hire
// @access  Private (employer/client)
const createHireRequest = async (req, res) => {
    try {
        const { workerId, title, description, budget, location } = req.body;

        if (!workerId || !title || !description) {
            return res.status(400).json({ message: 'Worker, title and description are required.' });
        }

        const worker = await User.findById(workerId);
        if (!worker || worker.role !== 'worker') {
            return res.status(404).json({ message: 'Worker not found.' });
        }

        // Prevent sending a request to yourself
        if (worker._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot hire yourself.' });
        }

        // Prevent duplicate pending requests to the same worker
        const existing = await HireRequest.findOne({
            employer: req.user._id,
            worker: workerId,
            status: 'Pending'
        });
        if (existing) {
            return res.status(400).json({ message: 'You already have a pending hire request for this professional.' });
        }

        const hireRequest = await HireRequest.create({
            employer: req.user._id,
            worker: workerId,
            title,
            description,
            budget: budget || undefined,
            location: location || undefined
        });

        const populated = await hireRequest.populate([
            { path: 'employer', select: 'name email' },
            { path: 'worker', select: 'name skills bio' }
        ]);

        res.status(201).json(populated);
    } catch (error) {
        console.error('Error creating hire request:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

// @desc    Get hire requests sent by the logged-in employer
// @route   GET /api/hire/sent
// @access  Private
const getSentHireRequests = async (req, res) => {
    try {
        const requests = await HireRequest.find({ employer: req.user._id })
            .populate('worker', 'name skills bio location')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching sent hire requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get hire requests received by the logged-in worker
// @route   GET /api/hire/received
// @access  Private
const getReceivedHireRequests = async (req, res) => {
    try {
        const requests = await HireRequest.find({ worker: req.user._id })
            .populate('employer', 'name')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching received hire requests:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update the status of a hire request (accept/decline/complete)
// @route   PUT /api/hire/:id
// @access  Private (worker or employer depending on action)
const updateHireRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ['Accepted', 'Declined', 'Completed'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: `Status must be one of: ${allowedStatuses.join(', ')}` });
        }

        const hireRequest = await HireRequest.findById(req.params.id);
        if (!hireRequest) {
            return res.status(404).json({ message: 'Hire request not found.' });
        }

        const isWorker = hireRequest.worker.toString() === req.user._id.toString();
        const isEmployer = hireRequest.employer.toString() === req.user._id.toString();

        // Workers can accept or decline; employers can mark completed
        if ((status === 'Accepted' || status === 'Declined') && !isWorker) {
            return res.status(403).json({ message: 'Only the worker can accept or decline a hire request.' });
        }
        if (status === 'Completed' && !isEmployer) {
            return res.status(403).json({ message: 'Only the employer can mark a hire request as completed.' });
        }

        hireRequest.status = status;
        await hireRequest.save();

        const populated = await hireRequest.populate([
            { path: 'employer', select: 'name email' },
            { path: 'worker', select: 'name skills bio' }
        ]);

        res.json(populated);
    } catch (error) {
        console.error('Error updating hire request:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createHireRequest,
    getSentHireRequests,
    getReceivedHireRequests,
    updateHireRequestStatus
};
