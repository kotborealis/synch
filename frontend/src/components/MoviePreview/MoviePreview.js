import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {PlayerStandalone} from '../PlayerStandalone/PlayerStandalone';
import Button from '@material-ui/core/Button';

export const MoviePreview = ({room} = {}) => {
    return (<Paper elevation={3}>
        <Grid container
              spacing={5}
              direction="row"
              justify="center"
              alignItems="center"
        >
            <Grid item xs={6}>
                <PlayerStandalone room={room} initialMute={true} autoplay={true}/>
            </Grid>
            <Grid item xs={6}>
                <Typography>
                    <Typography variant="h3">
                        {room.title}
                    </Typography>
                    <Typography>
                        {room.description}
                    </Typography>
                </Typography>
                <Button type="submit" variant="contained" color="primary">
                    Присоединиться к просмотру
                </Button>
            </Grid>
        </Grid>
    </Paper>);
}