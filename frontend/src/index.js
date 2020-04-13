import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter, matchPath, Route, Switch} from 'react-router-dom';
import './api';
import {ViewOnboarding} from './views/Onboarding/Onboarding';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {ViewRoom} from './views/Room/Room';

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
        <Route path="/room/:roomId"><ViewRoom/></Route>
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