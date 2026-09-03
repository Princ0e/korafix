const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, applyForJob, getJobFilters } = require('../controllers/jobController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

router.route('/filters').get(getJobFilters);
router.route('/').get(getJobs).post(protect, createJob);
router.route('/:id').get(getJobById);
router.route('/:id/apply').post(optionalProtect, applyForJob);

module.exports = router;


