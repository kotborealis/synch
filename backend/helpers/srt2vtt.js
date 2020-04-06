module.exports = (data) =>
    data.substr(0, 8) === 'WEBVTT\n\n' ? data :
        'WEBVTT\n\n' + data.replace(/\r/g, '').split('\n').map(line => line
                         .replace(/\{\\([ibu])\}/g, '</$1>')
                         .replace(/\{\\([ibu])1\}/g, '<$1>')
                         .replace(/\{([ibu])\}/g, '<$1>')
                         .replace(/\{\/([ibu])\}/g, '</$1>')
                         .replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, '$1.$2')
                     ).join('\n');