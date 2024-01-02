import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    from: String,
    type: String,
    message: String,
    key: String,
    filename: String,
    size: String,
})

const roomSchema = new mongoose.Schema({
    _id: { type: String, required: true, uinque: true },
    timeOut: Number,
    password: String,
    safeMode: Boolean,
    maxCandidate: Number,
    desc: String,
    participants: [String],
    admin: [String],
    chats: [chatSchema]
});

const RoomModel = mongoose.model('Room', roomSchema);
export default RoomModel;