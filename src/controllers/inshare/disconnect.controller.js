import {
    ErrorHandler,
    removeUserIfExist
} from "../../middlewares/inshare/index.js";

export async function disconnect(data, cb, socket, io, userData) {
    try {
        // check if already exist or not -> if yes, then remove form that 
        await removeUserIfExist(socket, io, userData);
    } catch (error) {
        ErrorHandler(error, cb);
    }
}

