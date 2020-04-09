import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import api from '../../../api';
import Container from '@material-ui/core/Container';
import {MoviePreview} from '../../../components/MoviePreview/MoviePreview';

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
        <MoviePreview room={room}/>
    </Container>);
};