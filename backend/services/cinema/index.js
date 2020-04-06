const logger = require('../../lib/logger')('cinema');
const {Service} = require('../../lib/service');

module.exports = function(config) {
    async function sub(req) {
        req.status(true);
    }

    async function unsub(req) {

    }

    async function test(req) {
        req.send('Hey!!!');
    }

    new Service({
        config,
        name: 'cinema',
        handlers: {
            public: {
                sub,
                unsub,
                test
            }
        }
    });
};