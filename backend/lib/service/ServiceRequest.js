class ServiceRequest {
    service;
    client;
    event;
    data;
    msg_id;

    /**
     *
     * @param {Service} service Service instance
     * @param {ServiceClient} client Client instance
     * @param event Event name
     * @param data Data object
     * @param msg_id Message id
     */
    constructor({service, client, event, data, msg_id}) {
        this.service = service;
        this.client = client;
        this.event = event;
        this.data = data;
        this.msg_id = msg_id;

        this.id = this.client.id;
        this.user = this.client.user;

        this.logger = require('../logger')(`ServiceRequest::${service.name}::${client.id}::${msg_id}`);
    }

    /**
     * Send data as answer to request
     * @param data
     */
    send(data = {}) {
        const {service, msg_id, client: {id: target}} = this;
        service.transport.emit({channel: 'internal', target: 'router'}, 'output', {
            msg_id, target, data
        });
    }

    /**
     * Respond with status
     * @param status
     * @param text
     */
    status(status = true, text = '') {
        this.send({status, text});
    }

    /**
     *
     * @param event
     * @param data
     */
    emit(event, data) {
        this.client.emit(event, data);
    }
}

module.exports = {ServiceRequest};