import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter, matchPath, Route, Switch, withRouter} from 'react-router-dom';
import Container from '@material-ui/core/Container';
import './api';
import {ViewOnboarding} from './views/Onboarding/Onboarding';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {ViewRoomLobby} from './views/Room/Lobby/Lobby';
import {ViewRoomWatch} from './views/Room/Watch/Watch';

const RouterRoot = ({children}) => {
    return (
        <BrowserRouter basename={process.env.PUBLIC_PATH}>
            <Switch>
                {children}
            </Switch>
        </BrowserRouter>
    );
};

const Routes = () => {
    return (<>
        <Route exact path="/"><ViewOnboarding/></Route>
        <Route path="/room/:roomId/lobby"><ViewRoomLobby/></Route>
        <Route path="/room/:roomId/watch"><ViewRoomWatch/></Route>
    </>);
};

const theme = createMuiTheme({
    palette: {
        type: 'dark'
    }
});

render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterRoot><Routes/></RouterRoot>
    </ThemeProvider>,
    document.getElementById('App')
);