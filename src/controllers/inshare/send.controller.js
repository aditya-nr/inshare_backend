import { inshareEventEnum } from "../../../constants.js";
import {
    ErrorHandler,
    insharePolicy,
    parseAndValidateData
} from "../../middlewares/inshare/index.js";
import RoomModel from '../../model/room.model.js';

export async function send(data, cb, socket, io, userData) {

    try {
        const user = socket.user;
        if (!user)
            socket.emit(inshareEventEnum.TIMEOUT);

        // parse and validate data
        const parsedData = await parseAndValidateData.send(data, user);

        // fetch room doc
        const room = await RoomModel.findById(user.roomId);
        if (!room)
            socket.emit(inshareEventEnum.TIMEOUT);

        // verify policy 
        await insharePolicy.send(room, parsedData);

        // emit msg
        socket.to(room._id).emit(inshareEventEnum.MESSAGE, parsedData);

        // return
        cb({
            status: 'OK'
        })
    } catch (error) {
        ErrorHandler(error, cb);
    }

}

