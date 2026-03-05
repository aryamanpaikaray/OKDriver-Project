const express = require('express');
const { getAllDrivers, getDriverDetails, addDriver } = require('../controllers/driverController');

const router = express.Router();

/**
 * @route POST /api/drivers_list
 * @desc Add a new driver
 */
router.post('/', addDriver);

/**
 * @route GET /api/drivers
 * @desc List all drivers and top-level stats
 */
router.get('/', getAllDrivers);

/**
 * @route GET /api/drivers/:id
 * @desc Get specific driver profile and events
 */
router.get('/:id', getDriverDetails);

module.exports = router;
