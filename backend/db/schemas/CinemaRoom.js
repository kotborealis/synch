const mongoose = require('mongoose');

module.exports = mongoose.Schema({
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
    }
});