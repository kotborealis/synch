const config = require('chen.js').config('.config.js');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.mongo.host}/${config.mongo.db}`);
const mongo = mongoose.connection;

module.exports = {
    CinemaRoom: mongo.model('CinemaRoom', require('./schemas/CinemaRoom'), 'CinemaRooms'),
};

