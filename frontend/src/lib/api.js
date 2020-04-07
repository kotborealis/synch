let __msg_id = 0;

export default function(ws, token) {
    const channels_sub = new Set;
    const channels_desired_sub = new Set;

    const event_callback = new Map;
    const send_callback = new Map;

    ws.onopen = () => {
        ws.onmessage = (_) => {
            const raw_message = _.data || _;
            if(raw_message === '♥') return;
            try{
                const message = JSON.parse(raw_message);
                if(Array.isArray(message)){
                    message.forEach(handle_message.bind(this));
                }
                else{
                    handle_message.bind(this)(message);
                }
            }
            catch(e){
                console.error(e);
            }
        };
    };

    this.onConnectionLost = () => 0;

    ws.onerror = () => this.onConnectionLost();
    ws.onclose = () => this.onConnectionLost();

    function handle_message(message) {
        if(message.msg_id !== undefined){
            handle_response(message);
        }
        else{
            handle_event(message);
        }
    }

    function handle_response({msg_id, data}) {
        const callback = send_callback.get(msg_id);
        send_callback.delete(msg_id);
        if(callback) callback(data);
    }

    function handle_event({channel, event, data}) {
        const name = `${channel}--${event}`;

        const callback_set = event_callback.get(name);
        if(callback_set) callback_set.forEach(cb => cb(data));
    }

    const onReadyCallbacks = new Set;
    let ready = false;
    this.onReady = (callback) => {
        if(ready) callback();
        onReadyCallbacks.add(callback);
    };

    this.emitReady = () => {
        [...channels_sub.keys(), ...channels_desired_sub.keys()].forEach(channel => this.sub(channel, true));
        for(let callback of onReadyCallbacks){
            callback();
        }
        ready = true;
    };

    this.defferUntilConnection = (callback) => {
        if(ws.readyState === 1){
            callback();
        }
        else{
            setTimeout(this.defferUntilConnection.bind(null, callback), 200);
        }
    };

    this.defferUntilSub = (channel, callback) => {
        if(channels_sub.has(channel)){
            callback();
        }
        else{
            setTimeout(this.defferUntilSub.bind(null, channel, callback), 100);
        }
    };

    this.on = (channel, event, callback) => {
        const name = `${channel}--${event}`;

        if(!channels_sub.has(channel) && !channels_desired_sub.has(channel)){
            this.sub(channel);
        }

        if(!event_callback.has(name)){
            event_callback.set(name, new Set);
        }
        event_callback.get(name).add(callback);
    };

    this.remove = (channel, event, callback) => {
        const name = `${channel}--${event}`;
        if(event_callback.has(name)){
            event_callback.get(name).delete(callback);
        }
    };

    this.send = (channel, event, data, callback) => {
        if(!channels_sub.has(channel) && !channels_desired_sub.has(channel)){
            this.sub(channel);
        }

        const msg_id = __msg_id++;

        this.defferUntilConnection(() => {
            this.defferUntilSub(channel, () => {
                ws.send(JSON.stringify({
                    channel,
                    event,
                    data,
                    msg_id
                }));
            });
        });

        if(callback){
            send_callback.set(msg_id, callback);
        }
        else{
            return new Promise(resolve => send_callback.set(msg_id, resolve));
        }
    };

    this.sub = (channel, force = false) => {
        if(!channel) throw new Error('WRONG DOOR MF');
        if(!force && (channels_sub.has(channel) || channels_desired_sub.has(channel))) return;

        const msg_id = __msg_id++;

        channels_desired_sub.add(channel);

        this.defferUntilConnection(() => {
            ws.send(JSON.stringify({
                channel,
                event: 'sub',
                msg_id
            }));
        });


        return new Promise(resolve => send_callback.set(msg_id, ({status, reason}) => {
            if(status){
                channels_sub.add(channel);
                channels_desired_sub.delete(channel);
            }

            resolve({status, reason});
        }));
    };

    this.unsub = (channel) => {
        channels_sub.delete(channel);
        channels_desired_sub.delete(channel);

        const msg_id = __msg_id++;

        this.defferUntilConnection(() => {
            ws.send(JSON.stringify({
                channel,
                event: 'unsub',
                msg_id
            }));
        });
    };

    this.on('router', 'init', () => {
        setTimeout(this.emitReady, 0);
    });
};