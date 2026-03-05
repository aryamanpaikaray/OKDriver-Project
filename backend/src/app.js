const express = require('express');
const cors = require('cors');
const eventRoutes = require('./routes/eventRoutes');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', eventRoutes);
app.use('/api/drivers_list', require('./routes/driverRoutes')); // To avoid conflicting with the old '/api/drivers/live' in eventRoutes

// Error Handling Middleware
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message || 'Unknown error'}`, err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

module.exports = app;
