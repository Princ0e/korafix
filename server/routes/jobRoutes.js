const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, getJobFilters } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.route('/filters').get(getJobFilters);
router.route('/').get(getJobs).post(createJob);
router.route('/:id').get(getJobById);

module.exports = router;
