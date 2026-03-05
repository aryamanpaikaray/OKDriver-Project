const fs = require('fs');
// Simple console logger (can be replaced with winston/pino later)
const logger = {
    info: (msg) => {
        const str = `[INFO] ${new Date().toISOString()}: ${msg}`;
        console.log(str);
        fs.appendFileSync('debug.log', str + '\n');
    },
    warn: (msg) => {
        const str = `[WARN] ${new Date().toISOString()}: ${msg}`;
        console.warn(str);
        fs.appendFileSync('debug.log', str + '\n');
    },
    error: (msg, err) => {
        const str = `[ERROR] ${new Date().toISOString()}: ${msg}`;
        console.error(str);
        fs.appendFileSync('debug.log', str + '\n');
        if (err) {
            console.error(err);
            fs.appendFileSync('debug.log', (err.stack || err.toString()) + '\n');
        }
    },
};

module.exports = logger;
