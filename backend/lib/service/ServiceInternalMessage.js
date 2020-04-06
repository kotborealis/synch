class ServiceInternalMessage {
    event;
    data;
    source;
    target;

    /**
     * @param event Event name
     * @param data Data object
     */
    constructor({event, data, source, target}) {
        this.event = event;
        this.data = data;
        this.source = source;
        this.target = target;
    }
}

module.exports = {ServiceInternalMessage};