import React from 'react';
import {render} from 'react-dom';
import ReconnectingWebsocket from 'reconnecting-websocket';
import Storage from './lib/Storage';
import API from './lib/api';

const protocol = location.protocol === 'https:' ? 'wss' : 'ws';

const url = `${protocol}://${location.host}/ws.lc/`;
console.warn(`connecting to ${url}`);

const ws = new ReconnectingWebsocket(url);

const api = new API(ws);

window.api = api;

export default api;

render(
    `Hello world!`,
    document.getElementById('App')
);