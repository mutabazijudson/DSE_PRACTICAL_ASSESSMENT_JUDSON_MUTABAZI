
// routes/vehicleRoutes.js

const express = require('express');
const router = express.Router();
const { addVehicle, getMyVehicles } = require('../controllers/vehicleController');
const { authMiddleware } = require('../middleware/auth');
const { vehicleValidation, validateRequest } = require('../middleware/validation');

router.post('/add', authMiddleware, vehicleValidation, validateRequest, addVehicle);
router.get('/my-vehicles', authMiddleware, getMyVehicles);

module.exports = router;
