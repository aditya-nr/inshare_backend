import { errorTypesEnum, inshareEventEnum } from "../../../constants.js";
import { CustomError } from "../../middlewares/inshare/CustomError.js";
import {
    ErrorHandler,
    insharePolicy,
    removeUserIfExist,
    parseAndValidateData
} from "../../middlewares/inshare/index.js";
import RoomModel from '../../model/room.model.js';

export async function joinRoom(data, cb, socket, io, userData) {

    try {
        // check if already exist or not -> if yes, then remove form that 
        await removeUserIfExist(socket, io, userData);

        // parse and validate data
        const parsedData = await parseAndValidateData.joinUser(data);

        // fetch room doc
        const room = await RoomModel.findById(parsedData.roomId);
        if (!room)
            throw new CustomError(errorTypesEnum.INVALID_ROOMID, 'Invalid Room ID');

        // verify policy : password, maxCandidate
        await insharePolicy.joinRoom(room, parsedData);

        // join the room and notify
        socket.join(room._id);
        socket.to(room._id).emit(inshareEventEnum.NOTIFICATION, `${parsedData.name} joined the room`)

        // adjust room doc
        room.participants.push(socket.id);
        await room.save();

        // put into userData
        userData.set(socket.id, {
            name: parsedData.name,
            roomId: room._id
        })

        // return
        cb({
            status: 'OK',
            timeOut: room.timeOut
        })
    } catch (error) {
        ErrorHandler(error, cb);
    }

}