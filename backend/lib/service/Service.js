const ServiceInternalMessage = require('./ServiceInternalMessage').ServiceInternalMessage;

const {ServiceClient} = require('./ServiceClient');
const {ServiceRequest} = require('./ServiceRequest');
const {ServiceTransportRedis} = require('../serviceTransport/');

class Service {
    transport = null;

    name = null;

    logger = null;

    handlers = {
        public: {},
        internal: {}
    };

    // client id -> ServiceClient
    clients = new Map;

    ratelimit = false;
    name;

    /**
     *
     * @param redis Redis config
     * @param name Service name
     * @param handlersPublic Public handlers
     * @param handlersInternal Internal handlers
     * @param ratelimit Require ratelimit?
     */
    constructor({
                    config: {redis} = {},
                    name,
                    handlers: {
                        public: handlersPublic = {},
                        internal: handlersInternal = {}
                    } = {},
                    ratelimit = true
                }) {

        this.transport = new ServiceTransportRedis(name, redis);

        if(!name) throw new Error('Service requires name');

        this.ratelimit = ratelimit;
        this.name = name;

        this.logger = require('../logger')(`Service::${name}`);

        const {logger} = this;
        logger.info(`Initializing service`);

        this.handlers.public = handlersPublic;
        this.handlers.internal = handlersInternal;

        this.handlers.internal['router-discovery'] = this.registration.bind(this);

        const {transport} = this;
        transport.on({channel: 'public'},
            this.handleMessage.bind(this));
        transport.on({channel: 'internal', broadcast: true},
            this.handleInternalMessage.bind(this));

        this.registration();
    }

    registration() {
        this.logger.info(`Registering service`);
        this.emit_internal('router', 'service-register', {
            name: this.name,
            require_ratelimit: this.ratelimit
        });
    }

    /**
     * Emit internal message to specified service
     * @param target Name of the target service
     * @param event Event name
     * @param data Event data
     */
    emit_internal(target, event, data) {
        this.transport.emit({channel: 'internal', target}, event, data);
    };

    /**
     * Emit data to all clients or single client (if target_id specified)
     *
     * @param event Event name
     * @param data Event data
     * @param target_id
     */
    emit(event, data, target_id = undefined) {
        if(target_id !== undefined){
            if(this.clients.has(target_id)){
                this.clients.get(target_id).emit(event, data);
            }
        }
        else{
            // broadcast
            this.clients.forEach(client => client.emit(event, data));
        }
    }

    handleInternalMessage(msg) {
        const {logger} = this;
        try{
            const req = new ServiceInternalMessage(msg);

            const {event} = req;

            if(this.handlers.internal && this.handlers.internal.hasOwnProperty(event)){
                this.handlers.internal[event](req);
            }
        }
        catch(e){
            logger.warn(`Got invalid internal message`, msg, e);
        }
    }

    /**
     */
    async handleMessage({/*target, source, event,*/ data: req_data}) {
        const {logger} = this;

        const client = this.clients.has(req_data.id)
            ? this.clients.get(req_data.id)
            : new ServiceClient({service: this, id: req_data.id});

        const req = new ServiceRequest({
            service: this,
            client,
            event: req_data.event,
            data: req_data.data,
            msg_id: req_data.msg_id
        });

        const {event} = req_data;

        logger.debug(`Request with event ${event}`);

        if(event === 'sub'){
            this.subHandler(req);
        }
        else if(event === 'unsub'){
            this.unsubHandler(req);
        }
        else if(!this.clients.has(client.id)){
            this.logger.warn(`Pub to unsubbed service ${this.name}`);
            req.status(false, 'Pub to unsubbed service');
            return;
        }

        if(this.handlers.public.hasOwnProperty(event)){
            this.handlers.public[event](req);
        }
    }

    /**
     * Sub
     * @param req ServiceRequest
     */
    subHandler(req) {
        this.logger.debug('Sub handler');

        const {client} = req;
        this.clients.set(client.id, client);

        req.status(true);
    }

    unsubHandler(req) {
        this.logger.debug('UnSub handler');

        const {client} = req;

        this.clients.delete(client.id);

        req.status(true);
    }
}

module.exports = {Service};