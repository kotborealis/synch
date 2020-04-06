import Button from '@material-ui/core/Button';
import React, {useEffect, useState, useRef} from 'react';
import {useParams} from 'react-router-dom';
import api from '../../../api';
import {useSubtitles} from '../../../lib/SubtitlesManager';
import styles from './Watch.less';

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
        api.send('cinema', 'join', roomId);
        api.send('cinema', 'get', roomId).then(room => {
            setRoom(room);
        });
        return () => api.send('cinema', 'leave', roomId);
    }, []);

    const onPlay = () => api.send('cinema', 'play', roomId);
    const onPause = () => api.send('cinema', 'pause', roomId);


    return (
        <div className={styles.cinemaVideoContainer}>
            <video
                ref={video}
                preload="auto"
                src={room.stream}
            />
            <Button variant="contained" color="primary" onClick={onPlay}>
                Play
            </Button>
            <Button variant="contained" color="primary" onClick={onPause}>
                Pause
            </Button>
        </div>
    );
};