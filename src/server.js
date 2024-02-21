import https from 'https';
import fs from 'fs';
import { Server } from 'socket.io';

import { env } from '../constants.js';
import inShareSocketIntialize from './routes/inShare.routes.js';

const options = {
    key: fs.readFileSync(env.PRIVATE_KEY_PATH),
    cert: fs.readFileSync(env.CERTIFICATE_PATH)
};
const server = https.createServer(options);

const io = new Server(server, {
    cors: {
        origin: env.CORS_ORIGIN
    }
});

// routes import


inShareSocketIntialize(io);

export default server;