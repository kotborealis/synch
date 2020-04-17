const {loadSubtitles} = require('./loadSubtitles');
const {CinemaRoom} = require('../../db');
const {Service} = require('../../lib/service');

module.exports = function(config) {

    async function create(req) {
        req.data.subtitles = await loadSubtitles(req.data.subtitles);
        const room = new CinemaRoom(req.data);
        await room.save();
        req.send(room);
    }

    async function get(req) {
        req.send(await CinemaRoom.findById(req.data.room));
    }

    async function join(req) {
        await CinemaRoom.findByIdAndUpdate(req.data.room, {$addToSet: {clients: req.client.id}});
        req.emit('playback', await CinemaRoom.findById(req.data.room));
        req.status();
    }

    async function leave(req) {
        await CinemaRoom.findByIdAndUpdate(req.data.room, {$pull: {clients: req.client.id}});
        req.status();
    }

    async function unsub(req) {
        const rooms = await CinemaRoom.find({
            clients: {$in: [req.client.id]}
        });

        await Promise.all(rooms.map(room =>
            room.update({$pull: {clients: req.client.id}})
        ));
    }

    async function play(req) {
        const room = await CinemaRoom.findById(req.data.room);

        if(room.playback_started === 0){
            room.playback_started = Date.now();
            syncRoom(room);
            await room.save();
        }

        req.status();
    }

    async function pause(req) {
        const room = await CinemaRoom.findById(req.data.room);

        room.stream_start = room.time;
        room.playback_started = 0;

        syncRoom(room);
        await room.save();

        req.status();
    }

    async function seekTo(req) {
        const room = await CinemaRoom.findById(req.data.room);

        if(room.playing){
            room.playback_started = Date.now();
        }

        room.stream_start = Math.max(0, req.data.time);

        await syncRoom(room);

        await room.save();
    }

    async function sync(req) {
        const room = await CinemaRoom.findById(req.data.room);
        req.client.emit('playback', room);
        req.status();
    }

    const syncRoom = room =>
        room.clients.map(id => service.emit('playback', room, id));

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
                pause,
                seekTo,
                sync
            }
        }
    });
};