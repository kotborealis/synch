import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import React from 'react';
import Typography from '@material-ui/core/Typography';

export const SynchContainer = ({children}) =>
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
                {children}
            </Grid>
        </Grid>
    </Container>;