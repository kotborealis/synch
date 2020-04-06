const config = require('chen.js').config('.config.js');
new (require('./service'))(config);