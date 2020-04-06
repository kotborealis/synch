const config = require('chen.js').config('.config.js');
const winston = require('winston');

module.exports = (name) =>
    new (winston.Logger)({
        exitOnError: true,
        transports: [
            new (winston.transports.Console)({
                colorize: true,
                prettyPrint: true,
                timestamp: true,
                label: name,
                level: config.logger.level,
                handleExceptions: false
            })
        ],
    });