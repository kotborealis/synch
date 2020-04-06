const EventEmitter = require('events');

class ServiceTransport {
    service_name;
    events;

    /**
     *
     * @param service_name Name of the channel which uses this transport
     */
    constructor(service_name) {
        this.service_name = service_name;
        this.events = new EventEmitter;

        this.logger = require('../logger')(`${this.constructor.name}::${service_name}`);

        this.logger.info('Creating transport');
    }

    /**
     * Emit message to channel
     * @param channel
     * @param broadcast
     * @param event
     * @param data
     */
    emit({channel, target = '*'}, event, data) {
        this.logger.debug(`Emit to ${channel}::${target}: ${event}`);
    }

    /**
     * Subscription
     * @param channel
     * @param broadcast
     * @param callback
     */
    on({channel, broadcast = false}, callback) {
        this.logger.debug(`Subscription to ${channel}, broadcast=${broadcast}`);
    }
}

module.exports = {ServiceTransport};