const Category = require('../models/Category');
const Job = require('../models/Job');
const { syncCategoriesAndJobs, DESIRED_CATEGORIES } = require('../config/syncData');

// @desc    Get all categories (with automatic sync & job count)
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        let categories = await Category.find({});
        const hasEducation = categories.some(c => c.name === 'Education');
        const hasDriver = categories.some(c => c.name === 'Driver & Transport');

        // If categories are empty or missing key categories, run sync
        if (!categories || categories.length === 0 || !hasEducation || !hasDriver) {
            await syncCategoriesAndJobs();
            categories = await Category.find({});
        }

        // Count open jobs for each category
        const categoriesWithCounts = await Promise.all(
            categories.map(async (cat) => {
                const jobCount = await Job.countDocuments({
                    category: cat._id,
                    status: 'Open'
                });
                return {
                    ...cat.toObject(),
                    jobCount
                };
            })
        );

        res.json(categoriesWithCounts);
    } catch (error) {
        console.error('Error fetching/seeding categories:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

module.exports = { getCategories };
