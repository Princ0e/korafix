const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authUser, registerUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/', async (req, res) => {
    try {
        const workers = await User.find({ role: 'worker' }).select('-password -email -phone');
        const sanitizedWorkers = workers.map(w => {
            const workerObj = w.toObject();
            if (workerObj.socialLinks) {
                delete workerObj.socialLinks.whatsapp;
            }
            return workerObj;
        });
        res.json(sanitizedWorkers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

module.exports = router;
