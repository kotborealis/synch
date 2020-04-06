const http = require('http');
const WebsocketServer = require('ws').Server;
const uuid = require('uuid');
const TokenBucket = require('../tokenBucket');
const RouterClient = require('./RouterClient').RouterClient;

const {Service} = require('../service');

class Router {
    service;
    clients = new Map;
    channelsInfo = new Map;
    server;
    wss;

    constructor(config) {
        this.logger = require('../logger')(`Router`);

        this.server = http.createServer();
        this.wss = new WebsocketServer({server: this.server, perMessageDeflate: false});

        this.service = new Service({
            config,
            name: 'router',
            handlers: {
                public: {},
                internal: {
                    output: this.outputHandler.bind(this),
                    'service-register': this.serviceRegisterHandler.bind(this),
                }
            },
            ratelimit: false
        });

        const {channelsInfo, logger} = this;

        channelsInfo.set('router', {
            name: 'router',
            ratelimit: false
        });

        this.wss.on('connection', this.handleClientConnection.bind(this));

        this.server.listen(config.server.port, () => {
            logger.info(`Started server on ${this.server.address().port}!`);
        });

        this.service.transport.emit({
                channel: 'internal',
                target: '*'
            },
            'router-discovery',
        );

        this.startKeepAliveClients(config.server.keepAliveInterval);

        process.on('SIGINT', async () => {
            this.server.close();
            process.exit(0);
        });
    }

    startKeepAliveClients(interval) {
        setInterval(
            () => [...this.clients.values()].forEach(({ws}) => ws.send('♥', () => 0)),
            interval
        );
    }

    handleClientConnection(ws) {
        const {clients, logger} = this;
        const client = new RouterClient({
            id: uuid(),
            ws,
            bucket: new TokenBucket({capacity: 31, refillRate: 10})
        });
        clients.set(client.id, client);

        client.send({channel: 'router', event: 'init'});

        ws.on('message', async (raw_message) => {
            try{
                client.throttle(1, () => this.handleClientMessage(client, JSON.parse(raw_message)));
            }
            catch(e){
                logger.warn('Exception while handling message', {
                    exception: e.toString(),
                    trace: e.stack,
                    raw_message
                });
            }
        });

        const endConnection = () => this.handleClientDisconnect(client);

        ws.on('close', endConnection);
        ws.on('error', endConnection);
    }

    handleClientMessage(client, message) {
        const {channelsInfo, service} = this;

        if(!channelsInfo.has(message.channel)){
            client.send({
                channel: 'router',
                event: 'channel-not-found',
                data: 'channel-not-found',
                msg_id: message.msg_id
            });
            return;
        }

        if(message.event === 'sub'){
            if(channelsInfo.has(message.channel)){
                client.subs.add(message.channel);
            }
            else{
                client.send({
                    channel: message.channel,
                    event: 'sub',
                    data: {success: false},
                    msg_id: message.msg_id
                });
            }
        }
        else if(message.event === 'unsub'){
            client.subs.delete(message.channel);
        }

        client.bucket.throttle(channelsInfo.get(message.channel).require_ratelimit ? 1 : 0, () => {
            service.transport.emit({
                    channel: 'public',
                    target: message.channel
                },
                message.event,
                {
                    id: client.id,
                    auth: client.auth,
                    channel: message.channel,
                    event: message.event,
                    data: message.data,
                    msg_id: message.msg_id
                }
            );
        });
    }

    handleClientDisconnect(client) {
        client.subs.forEach(channel => {
            this.service.transport.emit({channel: 'public', target: channel}, 'unsub', {
                auth: client.auth,
                id: client.id,
                channel,
                event: 'unsub'
            });
        });

        this.clients.delete(client.id);
    }

    outputHandler({event, data, source}) {
        for(let client of this.clients.values()){
            if(!client.subs.has(source)){
                continue;
            }

            if(!data.target || data.target === client.id){
                client.send({
                    channel: source,
                    event: data.event,
                    data: data.data,
                    msg_id: data.msg_id
                });
            }
        }
    }

    serviceRegisterHandler({data}) {
        this.logger.info(`register service ${data.name}`);
        this.channelsInfo.set(data.name, data);

        for(let client of this.clients.values()){
            if(client.subs.has(data.name)){
                this.service.transport.emit({
                        channel: 'public',
                        target: data.name
                    },
                    'sub',
                    {
                        id: client.id,
                        auth: client.auth,
                        channel: data.name,
                        event: 'sub',
                        data: null,
                        msg_id: -1
                    }
                );
            }
        }
    }
}

module.exports = {Router};
