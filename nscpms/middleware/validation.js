
// ============================================
// middleware/validation.js
// ============================================
const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

const registerValidation = [
    body('fullname').trim().isLength({ min: 3 }).withMessage('Full name must be at least 3 characters'),
    body('phone').matches(/^07\d{8}$/).withMessage('Phone must be valid Rwandan number (07xxxxxxxx)'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['ParkingManager', 'Driver']).withMessage('Role must be ParkingManager or Driver')
];

const vehicleValidation = [
    body('plateNumber').trim().notEmpty().withMessage('Plate number is required'),
    body('vehicleType').isIn(['Car', 'Motorcycle', 'Bus', 'Truck']).withMessage('Invalid vehicle type')
];

const entryValidation = [
    body('plateNumber').trim().notEmpty().withMessage('Plate number is required'),
    body('vehicleType').isIn(['Car', 'Motorcycle', 'Bus', 'Truck']).withMessage('Invalid vehicle type')
];

const loginValidation = [
    body('phone').matches(/^07\d{8}$/).withMessage('Phone must be valid Rwandan number'),
    body('password').notEmpty().withMessage('Password is required')
];

module.exports = {
    validateRequest,
    registerValidation,
    vehicleValidation,
    entryValidation,
    loginValidation
};