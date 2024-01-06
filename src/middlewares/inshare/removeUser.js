import { inshareEventEnum } from "../../../constants.js";
import RoomModel from "../../model/room.model.js";

export async function removeUserIfExist(socket, io, userData) {
    const user = socket.user;
    if (!user) return;

    // remove from room
    socket.leave(user.roomId);
    socket.to(user.roomId).emit(inshareEventEnum.NOTIFICATION, `${user.name} left the room`);

    // remove form userData
    userData.delete(socket.id);

    // adjust room doc
    let room = await RoomModel.findById(user.roomId);
    if (!room) // if no room then return
        return;

    room.participants = room.participants.filter(socketId => socketId != socket.id);

    // if admin
    if (room.admin.includes(socket.id)) {
        // reomve from admin
        room.admin = room.admin.filter(socketId => socketId != socket.id);
        // if no admin is present, make participants[0] as new admin
        if (room.admin.length == 0 && room.participants.length) {
            room.admin.push(room.participants[0]);
            // send new admin notification
            let new_admin = userData.get(room.participants[0]);
            socket.to(room._id).emit(inshareEventEnum.NOTIFICATION, `${new_admin.name} is now admin`);
        }
    }

    //if cur user is the only participant in room or timeOut hits
    if ((room.participants.length == 0) || (room.timeOut < Date.now())) {
        // remove all it's participants from userData
        await RoomModel.findByIdAndDelete(room._id);
        room.participants.forEach(socketId => userData.delete(socketId));
        socket.to(room._id).emit(inshareEventEnum.TIMEOUT);
        io.of('/').adapter.del(room._id);
        return;
    }
    await room.save();
}