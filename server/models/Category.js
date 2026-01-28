const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    group: {
        type: String,
        required: true,
        enum: ['Office', 'Home', 'Technical', 'Mechanical', 'Construction', 'Healthcare', 'Education', 'Creative', 'Other']
    },
    image: String, // Optional icon/image
    description: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
