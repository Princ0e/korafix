const express = require('express');
const router = express.Router();
const {
    createHireRequest,
    getSentHireRequests,
    getReceivedHireRequests,
    updateHireRequestStatus
} = require('../controllers/hireController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createHireRequest);
router.get('/sent', protect, getSentHireRequests);
router.get('/received', protect, getReceivedHireRequests);
router.put('/:id', protect, updateHireRequestStatus);

module.exports = router;
