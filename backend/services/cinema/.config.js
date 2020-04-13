module.exports = {
    redis: {
        host: process.env.REDIS_HOST || 'redis',
        port: process.env.REDIS_PORT || 6379,
    },

    mongo: {
        host: process.env.MONGO_HOST || 'mongo',
        db: process.env.MONGO_DB || 'synch'
    },

    logger: {
        level: process.env.LOGGER_LEVEL || 'info'
    },
};