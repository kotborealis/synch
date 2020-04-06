const redis = require('redis');

module.exports = function(...args) {
    const config = args[0];
    return new Proxy(redis.createClient(...args), {
        get(target, prop) {
            const fn = target[prop].bind(target);

            if(['on', 'subscribe', 'unsubscribe', 'publish', 'quit'].indexOf(prop) >= 0) return fn;

            return (...args) => {
                if(prop === 'keys'){
                    args[0] = config.prefix + args[0];
                }
                if(typeof args.slice(-1)[0] === 'function'){
                    return fn(...args);
                }
                else{
                    return new Promise((resolve, reject) => fn(...args, (err, res) => {
                        if(err){
                            reject(err);
                        }
                        else{
                            resolve(res);
                        }
                    }));
                }
            };
        }
    });
};