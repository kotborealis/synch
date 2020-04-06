import Button from '@material-ui/core/Button';
import React, {useEffect, useState, useRef} from 'react';
import {useParams} from 'react-router-dom';
import api from '../../../api';
import {useSubtitles} from '../../../lib/SubtitlesManager';
import styles from './styles.less';
import {Controls} from './Controls';

export const ViewRoomWatch = () => {
    const {roomId} = useParams();
    const [room, setRoom] = useState({});

    const video = useRef();
    useSubtitles(video, room.subtitles);

    useEffect(() => {
        api.on('cinema', 'playback', (room) => {
            setRoom(room);
            video.current.currentTime = room.time;
            if(room.playing) video.current.play();
            else video.current.pause();
        });
    }, []);

    useEffect(() => {
        api.send('cinema', 'join', {room: roomId});
        api.send('cinema', 'get', {room: roomId}).then(room => {
            setRoom(room);
        });
        return () => api.send('cinema', 'leave', {room: roomId});
    }, []);

    const onPlay = () => api.send('cinema', 'play', {room: roomId});
    const onPause = () => api.send('cinema', 'pause', {room: roomId});
    const onSeek = (time) => api.send('cinema', 'seekTo', {room: roomId, time});


    return (
        <div className={styles.videoContainer}>
            <video
                ref={video}
                preload="auto"
                src={room.stream}
            />
            <Controls
                video={video}
                room={room}
                onPause={onPause}
                onPlay={onPlay}
                onSeek={onSeek}
            />
        </div>
    );
};