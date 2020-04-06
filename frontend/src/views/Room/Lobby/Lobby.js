import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import api from '../../../api';
import Container from '@material-ui/core/Container';

export const ViewRoomLobby = () => {
    const history = useHistory();
    const {roomId} = useParams();
    const [room, setRoom] = useState({});

    useEffect(() => {
        api.send('cinema', 'get', {room: roomId}).then(data => setRoom(data));
    });

    const onJoin = async () => {
        history.push(`/room/${roomId}/watch`);
    };

    return (<Container maxWidth="lg">
        <Paper elevation={3}>
            <Typography component="h1" variant="h5">Stream: {room.stream}</Typography>
            <Typography component="h1" variant="h5">Title: {room.title}</Typography>
            <Typography component="h1" variant="h5">Cover: {room.cover}</Typography>
            <Typography component="h1" variant="h5">Description: {room.description}</Typography>
            <Button variant="contained" color="primary" onClick={onJoin}>
                Join
            </Button>
        </Paper>
    </Container>);
};