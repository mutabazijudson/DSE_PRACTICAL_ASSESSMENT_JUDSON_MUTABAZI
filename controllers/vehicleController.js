

// controllers/vehicleController.js

const db = require('../config/database');

const addVehicle = async (req, res) => {
    try {
        const { plateNumber, vehicleType } = req.body;
        const userId = req.user.userId;
        
        const [existing] = await db.query('SELECT * FROM Vehicle WHERE plateNumber = ?', [plateNumber]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Vehicle already registered' });
        }
        
        const [result] = await db.query(
            'INSERT INTO Vehicle (plateNumber, vehicleType, userId) VALUES (?, ?, ?)',
            [plateNumber, vehicleType, userId]
        );
        
        res.status(201).json({
            message: 'Vehicle added successfully',
            vehicleId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add vehicle', details: error.message });
    }
};

const getMyVehicles = async (req, res) => {
    try {
        const [vehicles] = await db.query(
            'SELECT * FROM Vehicle WHERE userId = ?',
            [req.user.userId]
        );
        res.json({ vehicles });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch vehicles', details: error.message });
    }
};

module.exports = { addVehicle, getMyVehicles };
