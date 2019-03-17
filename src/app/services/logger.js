const winston = require('winston');
const fs = require('fs');

if(!fs.existsSync('src/app/logs')) {
    fs.mkdirSync('src/app/logs');
}

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: 'src/app/logs/api-bookstore-info.log',
            maxsize: 100000,
            maxFiles: 10
        }),
        new winston.transports.File({
            level: 'error',
            filename: 'src/app/logs/api-bookstore-error.log',
            maxsize: 100000,
            maxFiles: 10
        })
    ]
});

module.exports = logger;