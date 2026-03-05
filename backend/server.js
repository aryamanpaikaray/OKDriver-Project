require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { initWebSocket } = require('./src/websocket/socketServer');
const { startSimulation } = require('./src/simulator/eventGenerator');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = http.createServer(app);

// Initialize WebSocket server on top of HTTP server
initWebSocket(server);

server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    
    // Start the background worker for event simulation
    startSimulation();
});
