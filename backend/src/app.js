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

// Error Handling Middleware
app.use((err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
});

module.exports = app;
