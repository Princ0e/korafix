const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    console.log(`Protect middleware called for: ${req.method} ${req.originalUrl}`);
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
            return;
        }
    }

    if (!token) {
        res.status(401).json({ message: 'SERVER_AUTH_ERROR_NO_TOKEN' });
        return;
    }
};

const admin = (req, res, next) => {
    const adminEmails = [
        'admin@example.com',
        'qickfixer70@gmail.com',
        'quickfixer70@gmail.com'
    ];
    if (process.env.ADMIN_EMAIL) {
        adminEmails.push(process.env.ADMIN_EMAIL.toLowerCase().trim());
    }

    const email = req.user?.email ? req.user.email.toLowerCase().trim() : '';

    if (email === 'princerukesha@gmail.com') {
        return res.status(401).json({ message: 'Not authorized as an admin' });
    }

    const isAdmin = req.user && (
        req.user.role === 'admin' ||
        adminEmails.includes(email) ||
        req.user.name === 'Admin User'
    );

    if (isAdmin) {
        if (req.user.role !== 'admin') {
            req.user.role = 'admin';
            req.user.save().catch(err => console.error('Failed to auto-fix admin role:', err));
        }
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const optionalProtect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        } catch (error) {
            console.error('Optional auth error:', error.message);
        }
    }
    next();
};

module.exports = { protect, admin, optionalProtect };
