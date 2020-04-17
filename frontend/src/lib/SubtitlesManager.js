import ASS from 'ass.js';
import * as React from 'react';
import {useEffect} from 'react';

export const useSubtitles = (ref, {format, data} = {}) => {
    const ass = React.useRef();

    useEffect(() => {
        if(ass.current) ass.current.destroy();

        if(format === 'vtt'){
            const blob = new Blob([data], {type: 'text/vtt'});
            const url = URL.createObjectURL(blob);

            ref.current.innerHTML =
                `<track label="Default${Math.random()}" kind="subtitles" srcLang='en' src='${url}' default/>`;
        }
        else if(format === 'ass'){
            ass.current = new ASS(data, ref.current, {resampling: 'video_width'});
        }
    }, [format, data]);

    useEffect(() => {
        window.addEventListener('resize', () => ass.current ? ass.current.resize() : false);
        setTimeout(() => ass.current ? ass.current.resize() : false, 300);

        return () => {
            if(ass.current) ass.current.destroy();
        };
    }, []);

    return ref;
};