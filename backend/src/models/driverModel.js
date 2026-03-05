const db = require('../config/db');

const DriverModel = {
    /**
     * Get all drivers with basic stats
     */
    async getAllDrivers() {
        const [rows] = await db.execute(
            `SELECT d.id, d.name, d.vehicle_number, d.created_at,
             (SELECT COUNT(*) FROM trips t WHERE t.driver_id = d.id AND t.status = 'active') as is_active,
             (SELECT COUNT(*) FROM events e JOIN violations v ON e.id = v.event_id WHERE e.driver_id = d.id) as total_violations
             FROM drivers d
             ORDER BY d.name ASC`
        );
        return rows;
    },

    /**
     * Get single driver profile
     */
    async getDriverById(driverId) {
        const [rows] = await db.execute(`SELECT * FROM drivers WHERE id = ?`, [driverId]);
        return rows[0];
    },

    /**
     * Get a driver's recent events
     */
    async getDriverEvents(driverId, limit = 50) {
        const [rows] = await db.execute(
            `SELECT e.id, e.event_type, e.speed, e.location, e.timestamp, t.status as trip_status,
             (SELECT v.severity FROM violations v WHERE v.event_id = e.id LIMIT 1) as violation_severity
             FROM events e
             JOIN trips t ON e.trip_id = t.id
             WHERE e.driver_id = ?
             ORDER BY e.timestamp DESC
             LIMIT ?`,
            [driverId, limit]
        );
        return rows;
    },

    /**
     * Get a driver's recent violations
     */
    async getDriverViolations(driverId, limit = 20) {
        const [rows] = await db.execute(
            `SELECT v.id, v.event_id, v.type, v.severity, v.created_at, e.speed
             FROM violations v
             JOIN events e ON v.event_id = e.id
             WHERE e.driver_id = ?
             ORDER BY v.created_at DESC
             LIMIT ?`,
            [driverId, limit]
        );
        return rows;
    },

    /**
     * Create a new driver
     */
    async createDriver(name, vehicleNumber) {
        const [result] = await db.execute(
            `INSERT INTO drivers (name, vehicle_number) VALUES (?, ?)`,
            [name, vehicleNumber]
        );
        return result.insertId;
    }
};

module.exports = DriverModel;
