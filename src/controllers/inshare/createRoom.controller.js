import otp from 'otp-generator';
import {
    ErrorHandler,
    removeUserIfExist,
    parseAndValidateData
} from "../../middlewares/inshare/index.js";
import RoomModel from '../../model/room.model.js';

export async function createRoom(data, cb, socket, io, userData) {

    try {
        // check if already exist or not -> if yes, then remove form that 
        await removeUserIfExist(socket, io, userData);

        // parse and validate data
        const dataToStore = await parseAndValidateData.createUser(data, socket.id);

        // generate room code
        while (1) {
            let _id = otp.generate(4, {
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });

            dataToStore._id = _id;
            // check if already exist -> if yes then regenrate
            let doc = await RoomModel.findById(_id);
            if (!doc) break;
        }

        // save data
        await RoomModel.create(dataToStore);

        // join the room
        socket.join(dataToStore._id);

        // put into userData
        userData.set(socket.id, {
            name: dataToStore.name,
            roomId: dataToStore._id
        })

        // return
        cb({
            status: 'OK',
            roomId: dataToStore._id
        })
    } catch (error) {
        ErrorHandler(error, cb);
    }

}