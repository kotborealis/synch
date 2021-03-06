import Paper from '@material-ui/core/Paper';
import React from 'react';
import {useForm} from "react-hook-form";
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import api from '../../api';
import {useHistory} from "react-router-dom";
import styles from './styles.less';
import {SynchContainer} from '../../components/SynchContainer/SynchContainer';

export const ViewOnboarding = () => {
    const history = useHistory();
    const {register, handleSubmit} = useForm();

    const onSubmit = async data => {
        const {_id} = await api.send('cinema', 'create', data);
        history.push(`/room/${_id}`);
    };

    return (
        <SynchContainer>
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
        </SynchContainer>);
};