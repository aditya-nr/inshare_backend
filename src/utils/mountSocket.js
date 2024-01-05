import { ErrorHandler } from "../middlewares/inshare/index.js";

const logIncoming = (evnet, name, socket) => {
    console.log(`---${evnet}---> `, name, " : ", socket.id?.substring(socket.id.length - 8));
}

export function mountSocket(EVENT_NAME, LISTENER_FUNCTION, socket, io, userData) {
    socket.on(EVENT_NAME, (data, cb) => {
        try {
            // TODO :: add user(if exist) to socket.user
            let user = userData.get(socket.id);
            if (!user) {
                user = { name: data?.name };
            } else {
                socket.user = user;
            }

            // log
            logIncoming(EVENT_NAME, user.name, socket);

            // execute function
            LISTENER_FUNCTION(data, cb, socket, io, userData);
        } catch (error) {
            ErrorHandler(error, cb);
        }
    })
}