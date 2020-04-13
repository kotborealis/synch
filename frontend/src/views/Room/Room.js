import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import api from '../../api';
import Container from '@material-ui/core/Container';
import {MoviePreview} from '../../components/MoviePreview/MoviePreview';
import styles from './styles.less';
import {Player} from '../../components/Player/Player';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const RoomLobby = ({roomId, onJoin, localUrl, setLocalUrl}) => {
    const [room, setRoom] = useState({});
    const [localName, setLocalName] = useState(null);

    const onLocalStream = (e) => {
        const file = e?.target?.files?.[0];

        if(!file) {
            setLocalUrl(null);
        }
        else {
            setLocalUrl(URL.createObjectURL(file));
            setLocalName(file?.name);
        }
    }

    useEffect(() => {
        api.send('cinema', 'get', {room: roomId}).then(data => setRoom(data));
    });

    return (<Container maxWidth="lg">
        <MoviePreview room={{...room, stream: localUrl ?? room.stream}}/>
        <Paper elevation={3} className={styles.lobbyControlsContainer}>
            <Grid container spacing={5} direction="column">
                <Grid item>
                    <Typography>Если воспроизведение работает плохо, можно смотреть заранее скачанный файл:</Typography>
                    {localUrl && <Typography>Будет использоваться файл {localName}</Typography>}
                    <input
                        accept="video/*"
                        style={{display: 'none'}}
                        id="select-local-file-btn"
                        multiple
                        type="file"
                        onChange={onLocalStream}
                    />
                    <label htmlFor="select-local-file-btn">
                        <Button variant="contained" color="secondary" component="span">
                            Выбрать уже скачанный файл
                        </Button>
                    </label>
                </Grid>
                <Grid item>
                    <Button type="submit" variant="contained" color="primary" onClick={onJoin}>
                        Присоединиться к просмотру
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    </Container>);
};

const RoomWatch = ({roomId, localUrl}) => {
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
            room={{...room, stream: localUrl ?? room.stream}}
            videoTime={videoTime}
            setVideoTime={setVideoTime}
            onPlay={onPlay}
            onPause={onPause}
            onSeek={onSeek}
        />
    </div>);
};

export const ViewRoom = () => {
    const {roomId} = useParams();

    const [ready, setReady] = useState(false);
    const [localUrl, setLocalUrl] = useState(null);

    return ready
        ? <RoomWatch
            roomId={roomId}
            localUrl={localUrl}
        />
        : <RoomLobby
            roomId={roomId}
            onJoin={() => {
                setReady(true);
            }}
            localUrl={localUrl}
            setLocalUrl={setLocalUrl}
        />;
};