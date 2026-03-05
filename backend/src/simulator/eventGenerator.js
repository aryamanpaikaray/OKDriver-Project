const logger = require('../utils/logger');
const http = require('http');

/**
 * Event simulation worker
 * Generates events every 2-3 seconds for a random active driver
 */

const EventModel = require('../models/eventModel');

let driverTrips = [
    { driver_id: 1, trip_id: 1, name: 'John Doe' },
    { driver_id: 2, trip_id: 2, name: 'Jane Smith' },
    { driver_id: 3, trip_id: 3, name: 'Alan Turing' }
];

// Fetch dynamically every 15 seconds
setInterval(async () => {
    try {
        const drivers = await EventModel.getActiveDrivers();
        if (drivers && drivers.length > 0) {
            // map db struct to our sim struct
            driverTrips = drivers.map(d => ({
                driver_id: d.id,
                trip_id: d.current_trip_id,
                name: d.name
            }));
        }
    } catch (e) {
        logger.error("Failed to refresh drivers for simulation", e);
    }
}, 15000);

const eventTypes = [
    'normal_driving', 'normal_driving', 'normal_driving',
    'speeding', 'harsh_braking', 'drowsiness', 'lane_departure'
];

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomCoordinates() {
    // Generate roughly some US coordinates for visual effect
    const lat = (34.0000 + Math.random() * 2).toFixed(4);
    const lng = (-118.0000 + Math.random() * 2).toFixed(4);
    return `${lat},${lng}`;
}

function triggerEvent() {
    const trip = driverTrips[getRandomInt(0, driverTrips.length - 1)];
    const eventType = eventTypes[getRandomInt(0, eventTypes.length - 1)];

    let speed = getRandomInt(45, 75);

    // Modify speed based on event type
    if (eventType === 'speeding') {
        speed = getRandomInt(81, 105);
    } else if (eventType === 'harsh_braking') {
        speed = getRandomInt(10, 40); // slow down abruptly
    }

    const payload = JSON.stringify({
        driver_id: trip.driver_id,
        trip_id: trip.trip_id,
        event_type: eventType,
        speed: speed,
        timestamp: new Date().toISOString(),
        location: generateRandomCoordinates()
    });

    // Make local HTTP POST to self to simulate external worker calling the API layer
    const req = http.request({
        hostname: 'localhost',
        port: process.env.PORT || 5000,
        path: '/api/events',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    }, (res) => {
        // Just let it return
        res.on('data', () => { });
    });

    req.on('error', (e) => {
        logger.error(`Simulation Worker hit error calling local API: ${e.message}`);
    });

    req.write(payload);
    req.end();

    // Re-schedule next event between 2-3 seconds
    const nextTimeout = getRandomInt(2000, 3000);
    setTimeout(triggerEvent, nextTimeout);
}

function startSimulation() {
    // Start after slight delay to allow servers to boot
    logger.info("Starting Background Event Simulator...");
    setTimeout(triggerEvent, 5000);
}

module.exports = { startSimulation };
