const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['client', 'worker', 'company', 'admin'],
        default: 'client',
    },
    phone: {
        type: String,
    },
    // Profile specific fields
    bio: String,
    skills: [String],
    location: {
        address: String,
        city: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    socialLinks: {
        whatsapp: String,
        facebook: String,
        instagram: String,
        linkedin: String,
        twitter: String,
        tiktok: String,
        youtube: String,
        other: String
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
