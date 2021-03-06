module.exports = {
    server: {
        host: process.env.SERVER_HOST || 'lc4::pavellc',
        port: process.env.SERVER_PORT || 8017,
        keepAliveInterval: process.env.SERVER_KEEP_ALIVE_INTERVAL || 1000 * 10
    },

    redis: {
        host: process.env.REDIS_HOST || 'redis',
        port: process.env.REDIS_PORT || 6379,
    },

    logger: {
        level: process.env.LOGGER_LEVEL || 'info'
    },
};