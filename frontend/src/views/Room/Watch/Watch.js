import React, {useEffect, useState, useRef} from 'react';
import {useParams} from 'react-router-dom';
import api from '../../../api';
import {Player} from '../../../components/Player/Player';

export const ViewRoomWatch = () => {
    const {roomId} = useParams();
    const [room, setRoom] = useState({});

    useEffect(() =>
        api.on('cinema', 'playback', (room) => setRoom(room)),
        []
    );

    useEffect(() => {
        api.send('cinema', 'join', {room: roomId});
        api.send('cinema', 'get', {room: roomId}).then(room => {
            setRoom(room);
        });
        return () => api.send('cinema', 'leave', {room: roomId});
    }, []);

    const [videoTime, setVideoTime] = useState({current: 0, duration: 0});

    const onPlay = () => api.send('cinema', 'play', {room: roomId});
    const onPause = () => api.send('cinema', 'pause', {room: roomId});
    const onSeek = (time) => api.send('cinema', 'seekTo', {room: roomId, time});

    return (<Player
        room={room}
        videoTime={videoTime}
        setVideoTime={setVideoTime}
        onPlay={onPlay}
        onPause={onPause}
        onSeek={onSeek}
    />);
};

// TODO
// Autoplay manager
// interface
// local files