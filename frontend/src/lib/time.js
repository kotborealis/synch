function secondsToTime(seconds) {
    var h = seconds / 60 / 60 | 0;
    var m = (seconds / 60 | 0) - h * 60;
    var s = Math.floor(seconds - h * 60 * 60 - m * 60);
    if(h === 0){
        h = '';
    }
    else{
        h = h + ':';
    }
    if(m === 0){
        m = '00:';
    }
    else if(m < 10){
        m = '0' + m + ':';
    }
    else{
        m = m + ':';
    }
    if(s === 0){
        s = '00';
    }
    else if(s < 10){
        s = '0' + s;
    }
    return h + m + s;
}

function timeToSeconds(_time) {
    if(_time === undefined)
        return -1;

    let time = _time + '';
    time = time.replace('s', '').replace('m', ':').replace('h', ':');
    time = time.split(':').reverse();
    let multiplier = 1;
    let _ = 0;
    time.map(e => {
        _ += e * multiplier;
        multiplier *= 60;
    });
    return _;
}

export {secondsToTime, timeToSeconds};