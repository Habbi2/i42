const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = decoded;
        next();
    });
};

const isAdmin = (req, res, next) => {
    User.findById(req.user.id)
        .then(user => {
            if (user && user.role === 'admin') {
                next();
            } else {
                res.status(403).json({ message: 'Forbidden: Admins only' });
            }
        })
        .catch(err => res.status(500).json({ message: 'Server error' }));
};

module.exports = {
    authMiddleware,
    isAdmin
};