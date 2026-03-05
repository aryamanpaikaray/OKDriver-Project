const DriverModel = require('../models/driverModel');
const logger = require('../utils/logger');

const getAllDrivers = async (req, res, next) => {
    try {
        const drivers = await DriverModel.getAllDrivers();
        res.status(200).json({ success: true, data: drivers });
    } catch (error) {
        logger.error(`Failed to get all drivers: ${error.message}`, error);
        next(error);
    }
};

const getDriverDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        const driverId = parseInt(id, 10);

        if (isNaN(driverId)) {
            return res.status(400).json({ success: false, message: 'Invalid Driver ID' });
        }

        const profile = await DriverModel.getDriverById(driverId);
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Driver not found' });
        }

        const events = await DriverModel.getDriverEvents(driverId, 50);
        const violations = await DriverModel.getDriverViolations(driverId, 20);

        res.status(200).json({
            success: true,
            data: {
                profile,
                events,
                violations
            }
        });
    } catch (error) {
        logger.error(`Failed to get driver details: ${error.message}`, error);
        next(error);
    }
};

const addDriver = async (req, res, next) => {
    try {
        const { name, vehicle_number } = req.body;
        if (!name || !vehicle_number) {
            return res.status(400).json({ success: false, message: 'Name and Vehicle Number are required' });
        }

        const driverId = await DriverModel.createDriver(name, vehicle_number);

        const db = require('../config/db');
        await db.execute(`INSERT INTO trips (driver_id, status) VALUES (?, 'active')`, [driverId]);

        res.status(201).json({ success: true, data: { id: driverId, name, vehicle_number } });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Vehicle number already exists' });
        }
        logger.error(`Failed to add driver: ${error.message}`, error);
        next(error);
    }
};

module.exports = {
    getAllDrivers,
    getDriverDetails,
    addDriver
};
