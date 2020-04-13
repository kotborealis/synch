module.exports = {
    server: {
        host: process.env.SERVER_HOST || 'lc4::pavellc',
        port: process.env.SERVER_PORT || 8017,
        keepAliveInterval: process.env.SERVER_KEEP_ALIVE_INTERVAL || 1000 * 10
    },

    mongo: {
        host: process.env.MONGO_HOST || 'mongo',
        db: process.env.MONGO_DB || 'synch'
    },

    logger: {
        level: process.env.LOGGER_LEVEL || 'info'
    },
};