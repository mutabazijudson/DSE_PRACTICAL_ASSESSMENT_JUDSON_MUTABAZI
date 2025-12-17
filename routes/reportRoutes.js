
// routes/reportRoutes.js

const express = require('express');
const router = express.Router();
const { getDailyReport, getMonthlyReport } = require('../controllers/parkingController');
const { authMiddleware, isParkingManager } = require('../middleware/auth');

router.get('/daily', authMiddleware, isParkingManager, getDailyReport);
router.get('/monthly', authMiddleware, isParkingManager, getMonthlyReport);

module.exports = router;
