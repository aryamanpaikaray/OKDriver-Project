const express = require('express');
const { getAllDrivers, getDriverDetails } = require('../controllers/driverController');

const router = express.Router();

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
