import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {PlayerStandalone} from '../PlayerStandalone/PlayerStandalone';
import styles from './styles.less';

export const MoviePreview = ({room} = {}) => {
    return (<Paper elevation={3} className={styles.container}>
        <Grid container
              spacing={5}
              direction="row"
              justify="center"
              alignItems="center"
        >
            <Grid item xs={12} md={6}>
                <PlayerStandalone room={room} initialMute={true} autoplay={true}/>
            </Grid>
            <Grid item xs={12} md={6}>
                <Typography>
                    <Typography variant="h3">
                        {room.title || "Без названия"}
                    </Typography>
                    <Typography>
                        {room.description || "Без описания"}
                    </Typography>
                </Typography>
            </Grid>
        </Grid>
    </Paper>);
}