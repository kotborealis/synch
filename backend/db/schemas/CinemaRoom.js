const mongoose = require('mongoose');

const CinemaRoomScheme = mongoose.Schema({
    stream: {
        type: String,
        required: true
    },
    subtitles: {
        type: String,
        required: false
    },
    cover: {
        type: String,
        required: false
    },
    title: {
        type: String,
        require: false
    },
    description: {
        type: String,
        require: false
    },

    clients: {
        type: [String],
        require: false
    },

    playback_started: {
        type: Number,
        default: 0,
        require: false
    },

    stream_start: {
        type: Number,
        default: 0,
        require: false
    }
}, {
    timestamps: true
});

CinemaRoomScheme.virtual('time').get(function () {
    if(this.playback_started === 0)
        return this.stream_start;

    const time_since_start = Math.floor((Date.now() - (this.playback_started)) / 1000);
    return time_since_start + this.stream_start;
});

CinemaRoomScheme.virtual('playing').get(function () {
    return this.playback_started !== 0;
});

CinemaRoomScheme.set('toJSON', { virtuals: true });

module.exports = CinemaRoomScheme;