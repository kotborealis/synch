const srt2vtt = require('../../helpers/srt2vtt');
const http_get = require('../../helpers/http_get');

const isASS = data => data.slice(0, 13) === '[Script Info]';

module.exports.loadSubtitles = async url => {
    if(!url) return {url};

    const data = await http_get(url);

    return {
        url,
        format: isASS(data) ? 'ass' : 'vtt',
        data: isASS(data) ? data : srt2vtt(data)
    };
};