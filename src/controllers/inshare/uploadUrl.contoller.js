import { ErrorHandler, parseAndValidateData } from "../../middlewares/inshare/index.js";
import RoomModel from "../../model/room.model.js";
import { FileServie } from "../../services/file.service.js";

export const uploadUrl = async (data, cb, socket, io, userData) => {
    try {
        const user = socket.user;
        if (!user)
            socket.emit(inshareEventEnum.TIMEOUT);

        // parse and validate data
        const parsedData = await parseAndValidateData.uploadUrl(data);

        // fetch room doc
        const room = await RoomModel.findById(user.roomId);
        if (!room)
            throw new CustomError(errorTypesEnum.INVALID_ROOMID, 'Invalid Room ID');


        // generate url 
        const filename = `${Date.now()}_${Math.floor(Math.random() * 100000) + 1}`;
        const key = `inshare/${filename}`;
        const url = await FileServie.putObjectUrl(key, parsedData.type, parsedData.size);

        // return
        cb({
            status: 'OK',
            url, key
        })

    } catch (error) {
        ErrorHandler(error, cb);
    }
}