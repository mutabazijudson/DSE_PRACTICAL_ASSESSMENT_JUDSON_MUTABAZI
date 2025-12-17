// ============================================
// utils/feeCalculator.js
// ============================================
const calculateParkingFee = (entryTime, exitTime) => {
    const entry = new Date(entryTime);
    const exit = new Date(exitTime);
    
    const diffMs = exit - entry;
    const diffHours = diffMs / (1000 * 60 * 60);
    
    let totalHours = Math.ceil(diffHours);
    let totalAmount = 0;
    
    if (totalHours <= 1) {
        totalAmount = 1500;
        totalHours = 1;
    } else {
        totalAmount = 1500 + ((totalHours - 1) * 1000);
    }
    
    return {
        totalHours: parseFloat(diffHours.toFixed(2)),
        totalAmount
    };
};

module.exports = { calculateParkingFee };