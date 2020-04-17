class RouterClient {
    // Client id
    id;

    // Client ip
    ip;

    // Websocket instance
    ws;

    // Subscriptions
    subs = new Set;

    // Token bucket for throttling
    bucket;

    /**
     *
     * @param auth Auth info object
     * @param id Client id
     * @param ws Websocket instance
     * @param bucket Tocken bucket instance
     */
    constructor({id, ws, bucket = null}) {
        this.id = id;
        this.ws = ws;
        this.ip = ws.upgradeReq.headers['x-forwarded-for'] || ws.upgradeReq.connection.remoteAddress;
        this.bucket = bucket;
    }

    /**
     * Send message to client
     * @param channel
     * @param event
     * @param data
     * @param msg_id
     */
    send({channel, event, data = {}, msg_id = undefined}) {
        this.ws.send(JSON.stringify({
            channel, event, data, msg_id
        }));
    }

    /**
     * Throttle function call using client's token bucket
     * @param consume_tokens
     * @param fn
     */
    throttle(consume_tokens, fn) {
        const {bucket} = this;
        bucket.throttle(consume_tokens, fn);
    }
}

module.exports = {RouterClient};