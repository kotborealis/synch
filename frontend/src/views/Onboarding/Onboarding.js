import Paper from '@material-ui/core/Paper';
import React from 'react';
import {useForm} from "react-hook-form";
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import api from '../../api';
import {useHistory} from "react-router-dom";
import Container from '@material-ui/core/Container';

export const ViewOnboarding = () => {
    const history = useHistory();
    const {register, handleSubmit} = useForm();

    const onSubmit = async data => {
        const {_id} = await api.send('cinema', 'create', data);
        history.push(`/room/${_id}/lobby`);
    };

    return (
        <Container maxWidth="lg">
            <Paper elevation={3}>
                <Typography component="h1" variant="h5">Directed by David Lynch</Typography>
                <Typography component="h5">
                    Create new cinema room:
                </Typography>
                <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <TextField inputRef={register} name="stream" label="Video URL" variant="filled" fullWidth/>
                    <TextField inputRef={register} name="subtitles" label="Subtitles URL" variant="filled" fullWidth/>
                    <TextField inputRef={register} name="cover" label="Cover URL" variant="filled" fullWidth/>
                    <TextField inputRef={register} name="title" label="Title" variant="filled" fullWidth/>
                    <TextField inputRef={register} name="description" label="Description" variant="filled" fullWidth/>
                    <Button type="submit" variant="contained" color="primary">
                        Create
                    </Button>
                </form>
            </Paper>
        </Container>);
};