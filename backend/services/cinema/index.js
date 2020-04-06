const {ServiceClient} = require('../../lib/service');
const {CinemaRoom} = require('../../db');
const {Service} = require('../../lib/service');

module.exports = function(config) {

    async function create(req) {
        const room = new CinemaRoom(req.data);
        await room.save();
        req.send(room);
    }

    async function get(req) {
        req.send(await CinemaRoom.findById(req.data));
    }

    async function join(req) {
        await CinemaRoom.findByIdAndUpdate(req.data, {$addToSet: {clients: req.client.id}});
        req.emit('playback', await CinemaRoom.findById(req.data));
        req.status();
    }

    async function leave(req) {
        await CinemaRoom.findByIdAndUpdate(req.data, {$pull: {clients: req.client.id}});
        req.status();
    }

    async function unsub(req) {
        const rooms = await CinemaRoom.find({
            clients: { $in: [req.client.id] }
        });

        await Promise.all(rooms.map(room =>
            room.update({$pull: {clients: req.client.id}})
        ));
    }

    async function play(req) {
        const room = await CinemaRoom.findById(req.data);

        if(room.playback_started === 0) {
            room.playback_started = Date.now();
            room.clients.forEach(([id]) => service.emit('playback', room, id));
            await room.save();
        }

        req.status();
    }

    async function pause(req) {
        const room = await CinemaRoom.findById(req.data);

        room.stream_start = room.time;
        room.playback_started = 0;

        room.clients.forEach(([id]) => service.emit('playback', room, id));
        await room.save();

        req.status();
    }

    const service = new Service({
        config,
        name: 'cinema',
        handlers: {
            public: {
                create,
                get,
                join,
                leave,
                unsub,
                play,
                pause
            }
        }
    });
};