// Simple console logger (can be replaced with winston/pino later)
const logger = {
    info: (msg) => console.log(`[INFO] ${new Date().toISOString()}: ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()}: ${msg}`),
    error: (msg) => console.error(`[ERROR] ${new Date().toISOString()}: ${msg}`),
};

module.exports = logger;
