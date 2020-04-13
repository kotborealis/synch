import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import api from '../../api';
import Container from '@material-ui/core/Container';
import {MoviePreview} from '../../components/MoviePreview/MoviePreview';
import styles from './styles.less';
import {Player} from '../../components/Player/Player';

const RoomLobby = ({onJoin}) => {
    const history = useHistory();
    const {roomId} = useParams();
    const [room, setRoom] = useState({});

    useEffect(() => {
        api.send('cinema', 'get', {room: roomId}).then(data => setRoom(data));
    });

    return (<Container maxWidth="lg">
        <MoviePreview room={room} onJoin={onJoin}/>
    </Container>);
};

const RoomWatch = () => {
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

    return (<div className={styles.container}>
        <Player
            room={room}
            videoTime={videoTime}
            setVideoTime={setVideoTime}
            onPlay={onPlay}
            onPause={onPause}
            onSeek={onSeek}
        />
    </div>);
};

export const ViewRoom = () => {
    const [ready, setReady] = useState(false);

    return ready ? <RoomWatch/> : <RoomLobby onJoin={setReady.bind(true)}/>;
};