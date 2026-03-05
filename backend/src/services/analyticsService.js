const EventModel = require('../models/eventModel');
const logger = require('../utils/logger');

// Store simple in-memory state of trips to calculate consecutive rules
// In production this would be Redis.
const tripViolationCounts = {};

/**
 * Core Business Logic to Check if an Event Triggers a Violation
 * @param {Object} eventData
 */
const processEventAnalytics = async (eventData) => {
    let violationTriggered = false;
    let severity = 'low';

    // Example Rules:
    // If speed > 80 km/h -> trigger speeding violation
    if (eventData.event_type === 'speeding' || eventData.speed > 80) {
        violationTriggered = true;
        severity = eventData.speed > 100 ? 'critical' : (eventData.speed > 90 ? 'high' : 'medium');

        await EventModel.createViolation(eventData.id, 'speeding', severity);
        await increaseTripViolationTracker(eventData.trip_id);
    }

    // harsh braking, drowsiness, lane departure
    if (['harsh_braking', 'drowsiness', 'lane_departure'].includes(eventData.event_type)) {
        violationTriggered = true;
        severity = eventData.event_type === 'drowsiness' ? 'critical' : 'medium';

        await EventModel.createViolation(eventData.id, eventData.event_type, severity);
        await increaseTripViolationTracker(eventData.trip_id);
    }

    return {
        violationTriggered,
        severity
    };
};

/**
 * Maintain trip violation counts and adjust risk score
 * @param {Number} tripId 
 */
const increaseTripViolationTracker = async (tripId) => {
    if (!tripViolationCounts[tripId]) {
        tripViolationCounts[tripId] = 0;
    }
    tripViolationCounts[tripId]++;

    // Rule: If 3 violations occur in one trip -> increase risk score heavily
    if (tripViolationCounts[tripId] === 3) {
        logger.warn(`Trip ${tripId} has hit 3 violations. Increasing risk score heavily.`);
        // +1 violation count, +5.5 risk score bump
        await EventModel.updateAnalyticsSummary(1, 5.5);
    } else {
        // Standard increase: +1 violation count, +0.5 risk score
        await EventModel.updateAnalyticsSummary(1, 0.5);
    }
};

module.exports = {
    processEventAnalytics
};
