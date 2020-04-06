const {URL} = require('url');
const http = require('http');
const https = require('https');

module.exports = (url) => new Promise((resolve, reject) => {
    const resolver = (new URL(url)).protocol === `https:` ? https : http;

    resolver.get(url, (res) => {
        const {statusCode} = res;

        if(statusCode !== 200){
            reject(statusCode);
            res.resume();
            return;
        }

        let data = '';
        res.setEncoding('utf8');
        res.on('data', chunk => {
            data += chunk;
        });

        res.on('end', () => {
            resolve(data);
        });
    }).end();
});