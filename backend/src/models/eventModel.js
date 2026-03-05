const db = require('../config/db');

const EventModel = {
    /**
     * Insert a new event
     */
    async createEvent(eventData) {
        const { driver_id, trip_id, event_type, speed, location, timestamp } = eventData;
        const [result] = await db.execute(
            `INSERT INTO events (driver_id, trip_id, event_type, speed, location, timestamp) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [driver_id, trip_id, event_type, speed, location, timestamp || new Date()]
        );
        return result.insertId;
    },

    /**
     * Log a violation
     */
    async createViolation(eventId, type, severity) {
        const [result] = await db.execute(
            `INSERT INTO violations (event_id, type, severity) VALUES (?, ?, ?)`,
            [eventId, type, severity]
        );
        return result.insertId;
    },

    /**
     * Fetch active drivers
     */
    async getActiveDrivers() {
        const [rows] = await db.execute(
            `SELECT d.id, d.name, d.vehicle_number, t.id as current_trip_id, t.status 
             FROM drivers d 
             JOIN trips t ON d.id = t.driver_id 
             WHERE t.status = 'active'`
        );
        return rows;
    },

    /**
     * Get basic analytics summary
     */
    async getAnalyticsSummary() {
        // Here we could query analytics_summary, but for real-time we can also calculate
        const [rows] = await db.execute(`SELECT * FROM analytics_summary LIMIT 1`);
        return rows[0] || { total_trips: 0, active_drivers: 0, violation_count: 0, risk_score: 0.0 };
    },

    /**
     * Get recent violations joined with event and driver details
     */
    async getRecentViolations() {
        const [rows] = await db.execute(
            `SELECT v.id, v.event_id, v.type, v.severity, e.speed, e.timestamp, d.name as driver_name 
             FROM violations v
             JOIN events e ON v.event_id = e.id
             JOIN drivers d ON e.driver_id = d.id
             ORDER BY v.created_at DESC LIMIT 50`
        );
        return rows;
    },

    /**
     * Update the risk score based on violations
     */
    async updateAnalyticsSummary(violationCountIncrement, riskScoreAdd) {
        await db.execute(
            `UPDATE analytics_summary 
             SET violation_count = violation_count + ?, risk_score = risk_score + ?`,
            [violationCountIncrement, riskScoreAdd]
        );
    }
};

module.exports = EventModel;
