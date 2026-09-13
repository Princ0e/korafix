const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, applyForJob, getJobFilters, deleteJob, getMyJobs } = require('../controllers/jobController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

router.route('/filters').get(getJobFilters);
router.route('/my-jobs').get(protect, getMyJobs);
router.route('/').get(getJobs).post(protect, createJob);
router.route('/:id').get(getJobById).delete(protect, deleteJob);
router.route('/:id/apply').post(optionalProtect, applyForJob);

module.exports = router;


