const express = require('express');
const { ingestEvent, getAnalytics, getLiveDrivers, getViolations } = require('../controllers/eventController');

const router = express.Router();

/**
 * @route POST /api/events
 * @desc Ingest driver behavior events
 */
router.post('/events', ingestEvent);

/**
 * @route GET /api/analytics
 * @desc Get Analytics Summary
 */
router.get('/analytics', getAnalytics);

/**
 * @route GET /api/drivers/live
 * @desc Get Live Drivers
 */
/**
 * @route GET /api/drivers/live
 * @desc Get Live Drivers
 */
router.get('/drivers/live', getLiveDrivers);

/**
 * @route GET /api/violations
 * @desc Get Violations
 */
router.get('/violations', getViolations);

module.exports = router;
