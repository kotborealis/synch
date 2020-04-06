const config = require('chen.js').config('.config.js');
const {Router} = require('./lib/router/Router');

new Router(config);

new (require('./services/cinema'))(config);