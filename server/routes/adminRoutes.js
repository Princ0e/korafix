const express = require('express');
const router = express.Router();
const { getJobSeekers, getServiceSeekers } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/job-seekers', protect, admin, getJobSeekers);
router.get('/service-seekers', protect, admin, getServiceSeekers);

module.exports = router;
