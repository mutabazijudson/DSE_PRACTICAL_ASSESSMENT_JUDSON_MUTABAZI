
// ============================================
// controllers/parkingController.js
// ============================================
const db = require('../config/database');
const { calculateParkingFee } = require('../utils/feeCalculator');

const recordEntry = async (req, res) => {
    try {
        const { plateNumber, vehicleType } = req.body;
        const recordedBy = req.user.userId;
        
        let [vehicle] = await db.query('SELECT * FROM Vehicle WHERE plateNumber = ?', [plateNumber]);
        
        if (vehicle.length === 0) {
            const [result] = await db.query(
                'INSERT INTO Vehicle (plateNumber, vehicleType, userId) VALUES (?, ?, ?)',
                [plateNumber, vehicleType, recordedBy]
            );
            vehicle = [{ vehicleId: result.insertId }];
        }
        
        const vehicleId = vehicle[0].vehicleId;
        
        const [active] = await db.query(
            'SELECT * FROM ParkingRecord WHERE vehicleId = ? AND status = "Active"',
            [vehicleId]
        );
        
        if (active.length > 0) {
            return res.status(400).json({ error: 'Vehicle already has an active parking session' });
        }
        
        const entryTime = new Date();
        const [record] = await db.query(
            'INSERT INTO ParkingRecord (entryTime, vehicleId, recordedBy, status) VALUES (?, ?, ?, "Active")',
            [entryTime, vehicleId, recordedBy]
        );
        
        res.status(201).json({
            message: 'Vehicle entry recorded successfully',
            recordId: record.insertId,
            entryTime,
            plateNumber
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to record entry', details: error.message });
    }
};

const recordExit = async (req, res) => {
    try {
        const { recordId } = req.params;
        
        const [records] = await db.query(
            'SELECT * FROM ParkingRecord WHERE recordId = ? AND status = "Active"',
            [recordId]
        );
        
        if (records.length === 0) {
            return res.status(404).json({ error: 'Active parking record not found' });
        }
        
        const record = records[0];
        const exitTime = new Date();
        const { totalHours, totalAmount } = calculateParkingFee(record.entryTime, exitTime);
        
        await db.query(
            'UPDATE ParkingRecord SET exitTime = ?, totalHours = ?, totalAmount = ?, status = "Completed" WHERE recordId = ?',
            [exitTime, totalHours, totalAmount, recordId]
        );
        
        res.json({
            message: 'Vehicle exit recorded successfully',
            recordId,
            entryTime: record.entryTime,
            exitTime,
            totalHours,
            totalAmount
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to record exit', details: error.message });
    }
};

const getParkedVehicles = async (req, res) => {
    try {
        const [vehicles] = await db.query(`
            SELECT 
                pr.recordId,
                pr.entryTime,
                v.plateNumber,
                v.vehicleType,
                u.fullname as driverName,
                u.phone as driverPhone
            FROM ParkingRecord pr
            JOIN Vehicle v ON pr.vehicleId = v.vehicleId
            JOIN User u ON v.userId = u.userId
            WHERE pr.status = "Active"
            ORDER BY pr.entryTime DESC
        `);
        res.json({ parkedVehicles: vehicles });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch parked vehicles', details: error.message });
    }
};

const getParkingHistory = async (req, res) => {
    try {
        const [history] = await db.query(`
            SELECT 
                pr.recordId,
                pr.entryTime,
                pr.exitTime,
                pr.totalHours,
                pr.totalAmount,
                pr.status,
                v.plateNumber,
                v.vehicleType,
                u.fullname as driverName
            FROM ParkingRecord pr
            JOIN Vehicle v ON pr.vehicleId = v.vehicleId
            JOIN User u ON v.userId = u.userId
            ORDER BY pr.entryTime DESC
        `);
        res.json({ history });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch history', details: error.message });
    }
};

const getMyParkingRecords = async (req, res) => {
    try {
        const [records] = await db.query(`
            SELECT 
                pr.recordId,
                pr.entryTime,
                pr.exitTime,
                pr.totalHours,
                pr.totalAmount,
                pr.status,
                v.plateNumber,
                v.vehicleType
            FROM ParkingRecord pr
            JOIN Vehicle v ON pr.vehicleId = v.vehicleId
            WHERE v.userId = ?
            ORDER BY pr.entryTime DESC
        `, [req.user.userId]);
        
        res.json({ records });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch records', details: error.message });
    }
};

const getDailyReport = async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));
        
        const [report] = await db.query(`
            SELECT 
                COUNT(*) as totalVehicles,
                SUM(totalAmount) as totalRevenue,
                AVG(totalHours) as avgParkingDuration
            FROM ParkingRecord
            WHERE exitTime BETWEEN ? AND ? AND status = "Completed"
        `, [startOfDay, endOfDay]);
        
        const [details] = await db.query(`
            SELECT 
                pr.recordId,
                pr.entryTime,
                pr.exitTime,
                pr.totalHours,
                pr.totalAmount,
                v.plateNumber,
                v.vehicleType
            FROM ParkingRecord pr
            JOIN Vehicle v ON pr.vehicleId = v.vehicleId
            WHERE pr.exitTime BETWEEN ? AND ? AND pr.status = "Completed"
            ORDER BY pr.exitTime DESC
        `, [startOfDay, endOfDay]);
        
        res.json({
            date: targetDate.toISOString().split('T')[0],
            summary: report[0],
            details
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate report', details: error.message });
    }
};

const getMonthlyReport = async (req, res) => {
    try {
        const { year, month } = req.query;
        const targetYear = year ? parseInt(year) : new Date().getFullYear();
        const targetMonth = month ? parseInt(month) - 1 : new Date().getMonth();
        
        const startOfMonth = new Date(targetYear, targetMonth, 1);
        const endOfMonth = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);
        
        const [report] = await db.query(`
            SELECT 
                COUNT(*) as totalVehicles,
                SUM(totalAmount) as totalRevenue,
                AVG(totalHours) as avgParkingDuration
            FROM ParkingRecord
            WHERE exitTime BETWEEN ? AND ? AND status = "Completed"
        `, [startOfMonth, endOfMonth]);
        
        const [dailyBreakdown] = await db.query(`
            SELECT 
                DATE(exitTime) as date,
                COUNT(*) as vehicles,
                SUM(totalAmount) as revenue
            FROM ParkingRecord
            WHERE exitTime BETWEEN ? AND ? AND status = "Completed"
            GROUP BY DATE(exitTime)
            ORDER BY date
        `, [startOfMonth, endOfMonth]);
        
        res.json({
            period: `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`,
            summary: report[0],
            dailyBreakdown
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate monthly report', details: error.message });
    }
};

module.exports = {
    recordEntry,
    recordExit,
    getParkedVehicles,
    getParkingHistory,
    getMyParkingRecords,
    getDailyReport,
    getMonthlyReport
};


