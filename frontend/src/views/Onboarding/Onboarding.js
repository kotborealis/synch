import Paper from '@material-ui/core/Paper';
import React from 'react';
import {useForm} from "react-hook-form";
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import api from '../../api';
import {useHistory} from "react-router-dom";
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import styles from './styles.less';

export const ViewOnboarding = () => {
    const history = useHistory();
    const {register, handleSubmit} = useForm();

    const onSubmit = async data => {
        const {_id} = await api.send('cinema', 'create', data);
        history.push(`/room/${_id}`);
    };

    return (
        <Container maxWidth="lg">
            <Grid
                container
                spacing={5}
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Grid item>
                    <Typography variant="p" style={{textAlign: "center"}}>
                        <Typography variant="h1">
                            David Synch
                        </Typography>
                        <Typography variant="h4">
                            Синхронизированный просмотр трешака
                        </Typography>
                    </Typography>
                </Grid>
                <Grid item>
                    <Paper elevation={5} className={styles.createRoom}>
                        <Typography variant="h5" style={{textAlign: "center"}}>
                            Создадим новый кинозал?
                        </Typography>
                        <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                            <TextField inputRef={register}
                                       name="stream"
                                       label="Ссылка на видео (h264 + aac/mp3)"
                                       variant="outlined"
                                       helperText="h264 + aac/mp3 для лучшей совместимости"
                                       fullWidth
                            />

                            <TextField inputRef={register}
                                       name="subtitles"
                                       label="Ссылка на субтитры (ass/srt/vtt)"
                                       variant="outlined"
                                       fullWidth
                            />
                            <TextField
                                inputRef={register}
                                name="cover"
                                label="Обложка"
                                variant="outlined"
                                fullWidth
                            />
                            <TextField inputRef={register}
                                       name="title"
                                       label="Название"
                                       variant="outlined"
                                       fullWidth
                            />
                            <TextField inputRef={register}
                                       name="description"
                                       label="Описание"
                                       variant="outlined"
                                       fullWidth
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Создать
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Container>);
};