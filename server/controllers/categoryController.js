const Category = require('../models/Category');

const DEFAULT_CATEGORIES = [
    { name: 'Admin Assistant', group: 'Office', description: 'Virtual assistants, data entry, administrative tasks.' },
    { name: 'Web Developer', group: 'Technical', description: 'Websites, mobile apps, software development.' },
    { name: 'Plumber', group: 'Home', description: 'Pipe repairs, bathroom & kitchen installation.' },
    { name: 'Electrician', group: 'Home', description: 'Electrical wiring, repairs, appliance installation.' },
    { name: 'Carpenter', group: 'Construction', description: 'Woodworking, furniture making, framing.' },
    { name: 'Mechanic', group: 'Mechanical', description: 'Car repair, engine maintenance, diagnostics.' },
    { name: 'Graphic Designer', group: 'Creative', description: 'Logos, branding, social media graphics.' },
    { name: 'House Helper', group: 'Home', description: 'Housekeeping, cleaning, general home assistance.' },
    { name: 'Painter', group: 'Construction', description: 'Interior and exterior wall painting services.' },
    { name: 'Others', group: 'Other', description: 'Other specialized services not listed above.' }
];

// @desc    Get all categories (auto-seeds if empty)
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        let categories = await Category.find({});
        if (!categories || categories.length === 0) {
            console.log('Seeding default categories into database...');
            categories = await Category.insertMany(DEFAULT_CATEGORIES);
        }
        res.json(categories);
    } catch (error) {
        console.error('Error fetching/seeding categories:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

module.exports = { getCategories };
