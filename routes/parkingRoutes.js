
// routes/parkingRoutes.js

const express = require('express');
const router = express.Router();
const {
    recordEntry,
    recordExit,
    getParkedVehicles,
    getParkingHistory,
    getMyParkingRecords,
    getDailyReport,
    getMonthlyReport
} = require('../controllers/parkingController');
const { authMiddleware, isParkingManager } = require('../middleware/auth');
const { entryValidation, validateRequest } = require('../middleware/validation');

// Parking Manager routes
router.post('/entry', authMiddleware, isParkingManager, entryValidation, validateRequest, recordEntry);
router.put('/exit/:recordId', authMiddleware, isParkingManager, recordExit);
router.get('/parked-vehicles', authMiddleware, isParkingManager, getParkedVehicles);
router.get('/history', authMiddleware, isParkingManager, getParkingHistory);

// Driver routes
router.get('/my-records', authMiddleware, getMyParkingRecords);

module.exports = router;

