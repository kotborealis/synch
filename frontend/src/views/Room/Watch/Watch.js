import Button from '@material-ui/core/Button';
import React, {useEffect, useState, useRef} from 'react';
import {useParams} from 'react-router-dom';
import api from '../../../api';
import {useSubtitles} from '../../../lib/SubtitlesManager';
import styles from './styles.less';
import {Controls} from './Controls';
import {useStorage} from '../../../lib/StorageHooks';

export const ViewRoomWatch = () => {
    const {roomId} = useParams();
    const [room, setRoom] = useState({});
    const [volume, setVolume] = useStorage(`volume`, {value: 1, mute: false});
    const [fullscreen, setFullscreen] = useState(false);

    const video = useRef();
    useSubtitles(video, room.subtitles);

    useEffect(() => {
        api.on('cinema', 'playback', (room) => {
            setRoom(room);
            if(video.current){
                video.current.currentTime = room.time;
                if(room.playing) video.current.play();
                else video.current.pause();
            }
        });
    }, []);

    useEffect(() => {
        api.send('cinema', 'join', {room: roomId});
        api.send('cinema', 'get', {room: roomId}).then(room => {
            setRoom(room);
        });
        return () => api.send('cinema', 'leave', {room: roomId});
    }, []);

    const [videoTime, setVideoTime] = useState({current: 0, duration: 0});

    useEffect(() =>
            video.current?.addEventListener('timeupdate', () =>
                setVideoTime({
                    current: video.current.currentTime,
                    duration: video.current.duration
                })
            )
    , [video.current]);

    useEffect(() => {
        if(video.current)
            video.current.volume = volume.mute ? 0 : volume.value;
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


    const onPlay = () => api.send('cinema', 'play', {room: roomId});
    const onPause = () => api.send('cinema', 'pause', {room: roomId});
    const onSeek = (time) => api.send('cinema', 'seekTo', {room: roomId, time});
    const onVolume = (value) => setVolume({...volume, value, mute: false});
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

    return (
        <div className={styles.videoContainer}>
            <video
                ref={video}
                preload="auto"
                src={room.stream}
            />
            <Controls
                room={room}
                videoTime={videoTime}
                volume={volume.mute ? 0 : volume.value}
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
// interface
// local files