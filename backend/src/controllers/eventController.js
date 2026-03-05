const EventModel = require('../models/eventModel');
const { processEventAnalytics } = require('../services/analyticsService');
const logger = require('../utils/logger');
let broadcastMessage;

/**
 * We inject the websocket broadcaster here so we don't cause circular dependencies
 * with socketServer.js
 */
const setBroadcaster = (fn) => {
    broadcastMessage = fn;
};

/**
 * Controller for ingesting events
 */
const ingestEvent = async (req, res, next) => {
    try {
        const eventData = req.body;

        // Basic Validation
        if (!eventData.driver_id || !eventData.trip_id || !eventData.event_type || !eventData.speed) {
            return res.status(400).json({ success: false, message: 'Missing required event fields' });
        }

        // 1. Insert into database
        const eventId = await EventModel.createEvent(eventData);

        // 2. Process for Violations and Analytics
        const analyticsResult = await processEventAnalytics({ ...eventData, id: eventId });

        // 3. Broadcast Event to WebSockets
        if (broadcastMessage) {
            broadcastMessage('NEW_EVENT', {
                id: eventId,
                ...eventData,
                violationTriggered: analyticsResult.violationTriggered,
                severity: analyticsResult.severity || null
            });

            if (analyticsResult.violationTriggered) {
                broadcastMessage('NEW_VIOLATION', {
                    event_id: eventId,
                    type: eventData.event_type,
                    severity: analyticsResult.severity,
                    driver_id: eventData.driver_id,
                    speed: eventData.speed,
                    timestamp: eventData.timestamp || new Date()
                });
                // Broadcast updated analytics optionally
                const summary = await EventModel.getAnalyticsSummary();
                broadcastMessage('ANALYTICS_UPDATE', summary);
            }
        }

        res.status(201).json({
            success: true,
            message: 'Event logged successfully',
            data: { id: eventId, violationTriggered: analyticsResult.violationTriggered }
        });

    } catch (error) {
        logger.error(`Event Ingestion Failed: ${error.message}`);
        next(error);
    }
};

const getAnalytics = async (req, res, next) => {
    try {
        const summary = await EventModel.getAnalyticsSummary();
        res.status(200).json({
            success: true, data: {
                totalTrips: summary.total_trips,
                activeDrivers: summary.active_drivers,
                violationCount: summary.violation_count,
                riskScore: summary.risk_score
            }
        });
    } catch (error) {
        next(error);
    }
};

const getLiveDrivers = async (req, res, next) => {
    try {
        const drivers = await EventModel.getActiveDrivers();
        res.status(200).json({ success: true, data: drivers });
    } catch (error) {
        next(error);
    }
};

const getViolations = async (req, res, next) => {
    try {
        const violations = await EventModel.getRecentViolations();
        res.status(200).json({ success: true, data: violations });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    ingestEvent,
    getAnalytics,
    getLiveDrivers,
    getViolations,
    setBroadcaster
};
