import cron from 'node-cron';
import { inshareEventEnum } from "../../constants.js";
import { createRoom, joinRoom, disconnect, send, uploadUrl } from "../controllers/inshare/index.js";
import RoomModel from "../model/room.model.js";
import { mountSocket } from "../utils/mountSocket.js";


const userData = new Map();
const inShareSocketIntialize = (io) => {
    // cron
    cron.schedule('*/30 * * * *', async () => {
        try {
            // Find rooms with a timeOut less than the current time
            const rooms = await RoomModel.find({ timeOut: { $lt: Date.now() } });
            await RoomModel.deleteMany({ timeOut: { $lt: Date.now() } });
            // Process each room
            for (const room of rooms) {
                console.log("CRON JOB -> Room deleted : ", room._id);
                // Remove participants from userData Map
                room.participants.forEach(socketId => userData.delete(socketId));

                // Remove room from Socket.IO adapter
                io.of('/').adapter.del(room._id);
            }
        } catch (error) {
            console.error('Error in cron job::-->\n', error);
        }
    }).start();

    return io.on('connection', socket => {

        console.log("connected : ", socket.id);
        // mount all other controllers

        mountSocket(inshareEventEnum.CREATE_ROOM, createRoom, socket, io, userData);

        mountSocket(inshareEventEnum.JOIN_ROOM, joinRoom, socket, io, userData);

        mountSocket(inshareEventEnum.DISCONNECT, disconnect, socket, io, userData);

        mountSocket(inshareEventEnum.MESSAGE, send, socket, io, userData);

        mountSocket(inshareEventEnum.GET_UPLOAD_URL, uploadUrl, socket, io, userData);
    })
}

export default inShareSocketIntialize