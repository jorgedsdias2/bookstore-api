const winston = require('winston');
const fs = require('fs');

if(!fs.existsSync('src/app/logs')) {
    fs.mkdirSync('src/app/logs');
}

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: 'src/app/logs/api-bookstore.log',
            maxsize: 100000,
            maxFiles: 10
        })
    ]
});

module.exports = logger;