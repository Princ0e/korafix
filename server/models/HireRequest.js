const mongoose = require('mongoose');

const hireRequestSchema = new mongoose.Schema({
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    budget: {
        type: Number
    },
    location: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Declined', 'Completed'],
        default: 'Pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HireRequest', hireRequestSchema);
