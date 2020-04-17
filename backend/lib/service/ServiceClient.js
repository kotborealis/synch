class ServiceClient {
    // Service
    service;

    // Client id
    id;

    /**
     *
     * @param service Service
     * @param id Client id
     */
    constructor({service, id}) {
        this.service = service;
        this.id = id;
    }

    /**
     * Emit message to client
     * @param event
     * @param data
     */
    emit(event, data) {
        const {service: {transport}, id: target} = this;

        transport.emit({channel: 'internal', target: 'router'},
            'output',
            {
                target,
                event,
                data
            }
        );
    }
}

module.exports = {ServiceClient};