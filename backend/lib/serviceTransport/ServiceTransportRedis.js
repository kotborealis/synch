const redisClientWrapper = require('../redisClientWrapper');

const {ServiceTransport} = require('./ServiceTransport');

class ServiceTransportRedis extends ServiceTransport {
    pub;
    sub;

    /**
     *
     * @param service_name Name of the service which uses this transport
     * @param redis_config Redis configuration
     */
    constructor(service_name, redis_config) {
        super(service_name);

        this.pub = redisClientWrapper(redis_config);
        this.sub = redisClientWrapper(redis_config);

        this.sub.on('message', this.subMessageHandler.bind(this));
    }

    static getChannel(channel, name) {
        return [channel, name].join('::');
    }

    subMessageHandler(sub, raw) {
        this.events.emit(sub, JSON.parse(raw));
    }

    /**
     * Subscription
     * @param channel
     * @param broadcast
     * @param callback
     */
    on({channel, broadcast = false}, callback) {
        super.on({channel, broadcast}, callback);

        const ch = ServiceTransportRedis.getChannel(channel, this.service_name);
        this.sub.subscribe(ch);
        this.events.addListener(ch, callback);

        if(broadcast){
            const ch_all = ServiceTransportRedis.getChannel(channel, '*');
            this.sub.subscribe(ch_all);
            this.events.addListener(ch_all, callback);
        }
    }

    /**
     * Emit message to channel
     * @param channel
     * @param broadcast
     * @param event
     * @param data
     */
    emit({channel, target = '*'}, event, data) {

        super.emit({channel, target}, event, data);

        const ch = ServiceTransportRedis.getChannel(channel, target);

        this.pub.publish(ch, JSON.stringify({
            target,
            source: this.service_name,
            event,
            data
        }));
    }
}

module.exports = {ServiceTransportRedis};