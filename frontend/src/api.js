import API from './lib/api';
import ReconnectingWebsocket from 'reconnecting-websocket';

const protocol = location.protocol === 'https:' ? 'wss' : 'ws';

const url = `${protocol}://${location.host}/ws.lc/`;
console.warn(`connecting to ${url}`);

const ws = new ReconnectingWebsocket(url);

const api = new API(ws);

window.api = api;

export default api;