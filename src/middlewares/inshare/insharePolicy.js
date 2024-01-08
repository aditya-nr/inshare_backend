import bcryptjs from 'bcryptjs';
import { CustomError } from './CustomError.js';
export const insharePolicy = {
    joinRoom: async (room, data) => {
        // password 
        if (room.password) {
            if (!data.password)
                throw CustomError.PasswordRequired();
            if (!await bcryptjs.compare(data.password, room.password))
                throw CustomError.PasswordWrong();

        }

        // maxCandidate
        if (room.maxCandidate < (room.participants.length + 1))
            throw CustomError.PolicyViolate('Max Candidate reached');
    },

    send: async (room, data) => {

    }
}