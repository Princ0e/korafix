const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getJobs).post(protect, createJob);
router.route('/:id').get(getJobById);

module.exports = router;
