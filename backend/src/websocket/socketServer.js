const WebSocket = require('ws');
const logger = require('../utils/logger');
let wss;

function initWebSocket(server) {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        logger.info('New WebSocket Connection Initiated from Dashcam Front-end');

        ws.on('message', (message) => {
            logger.info(`Received WS message: ${message}`);
            // Could handle client ping-pongs/subscriptions here 
        });

        ws.on('close', () => {
            logger.warn('Client WebSocket disconnected');
        });

        // Push initial state if needed
        ws.send(JSON.stringify({ type: 'CONNECTION_ESTABLISHED', payload: { status: "OK", timestamp: Date.now() } }));
    });
}

function broadcastMessage(type, payload) {
    if (!wss) return;

    const message = JSON.stringify({ type, payload });

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Attach the broadcaster to the controller.
const { setBroadcaster } = require('../controllers/eventController');
setBroadcaster(broadcastMessage);

module.exports = { initWebSocket, broadcastMessage };
