
// ============================================
// middleware/auth.js
// ============================================
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

const isParkingManager = (req, res, next) => {
    if (req.user.role !== 'ParkingManager') {
        return res.status(403).json({ error: 'Access denied. Parking Manager only.' });
    }
    next();
};

module.exports = { authMiddleware, isParkingManager };
