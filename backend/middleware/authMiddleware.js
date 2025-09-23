const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        // 1. Get token from header and check if it exists
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ 
                status: 'error',
                message: 'Authentication required. Please provide a valid token.' 
            });
        }

        const token = authHeader.split(' ')[1];

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ['HS256'] // Only allow HS256 algorithm
        });

        // 3. Check if user still exists
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ 
                status: 'error',
                message: 'The user belonging to this token no longer exists.' 
            });
        }

        // 4. Grant access to protected route
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                status: 'error',
                message: 'Invalid token. Please log in again.' 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                status: 'error',
                message: 'Your token has expired. Please log in again.' 
            });
        }
        console.error('Auth Error:', error);
        res.status(401).json({ 
            status: 'error',
            message: 'Not authorized to access this route' 
        });
    }
};

module.exports = { protect };