import http from 'http';
import { Server } from 'socket.io';

import { env } from '../constants.js';
import inShareSocketIntialize from './routes/inShare.routes.js';

const server = http.createServer();

const io = new Server(server, {
    cors: {
        origin: env.CORS_ORIGIN
    }
});

// routes import


inShareSocketIntialize(io);

export default server;