import React, {useEffect, useRef, useState} from 'react';
import {useSubtitles} from '../../lib/SubtitlesManager';
import styles from './styles.less';
import {Controls} from './Controls';
import {useStorage} from '../../lib/StorageHooks';

export const Player = ({
                           room,
                           onPause,
                           onPlay,
                           onSeek,
                           initialMute = false
                       }) => {
    const [initialMuteState, setInitialMuteState] = useState(initialMute);

    const [videoTime, setVideoTime] = useState({current: 0, duration: 0});
    const [volume, setVolume] = useStorage(`volume`, {value: 1, mute: false});
    const [fullscreen, setFullscreen] = useState(false);

    const volumeValue = () => (volume.mute || initialMuteState) ? 0 : volume.value;

    const video = useRef();
    useSubtitles(video, room.subtitles);

    useEffect(() => {
        if(video.current){
            video.current.currentTime = room.time ?? 0;
            if(room.playing) video.current.play();
            else video.current.pause();
        }
    }, [room]);

    useEffect(() =>
            video.current?.addEventListener('timeupdate', () =>
                setVideoTime({
                    current: video.current.currentTime,
                    duration: video.current.duration
                })
            ),
        [video.current]
    );

    useEffect(() => {
        if(video.current)
            video.current.volume = volumeValue();
    }, [volume.value, volume.mute]);

    useEffect(() => {
        const events = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange'];
        events.forEach(e => document.addEventListener(e, onFullscreenChange));

        return () => events.forEach(e => document.removeEventListener(e, onFullscreenChange));
    }, []);


    const onFullscreenChange = () => {
        const fullscreen = document.fullscreenElement
                           || document.mozFullScreenElement
                           || document.webkitFullscreenElement;

        setFullscreen(fullscreen);
    };

    const onVolume = (value) => {
        setInitialMuteState(false);
        setVolume({...volume, value, mute: false});
    };
    const onMute = () => setVolume({...volume, mute: !volume.mute});
    const onFullscreen = () => {
        if(fullscreen){
            document.cancelFullScreen?.();
            document.mozCancelFullScreen?.();
            document.webkitCancelFullScreen?.();
        }
        else{
            document.body.requestFullscreen?.();
            document.body.mozRequestFullscreen?.();
            document.body.webkitRequestFullscreen?.();
        }
    };

    const [showControls, setShowControls] = useState(false);
    const [controlsTimeout, setControlsTimeout] = useState(null);


    const handleUserActivity = () => {
        setShowControls(true);
        controlsTimeout && clearTimeout(controlsTimeout);
        const tid = setTimeout(() => setShowControls(false), 2000);
        setControlsTimeout(tid);
    }

    return (
        <div
            className={styles.videoContainer}
            onMouseMove={handleUserActivity}
            onTouchStart={handleUserActivity}
        >
            <video
                ref={video}
                preload="auto"
                src={room.stream}
            />
            <Controls
                room={room}
                show={!room.playing || showControls}
                videoTime={videoTime}
                volume={volumeValue()}
                fullscreen={fullscreen}
                onPause={onPause}
                onPlay={onPlay}
                onSeek={onSeek}
                onVolume={onVolume}
                onMute={onMute}
                onFullscreen={onFullscreen}
            />
        </div>
    );
};

// TODO
// Autoplay manager
// local files