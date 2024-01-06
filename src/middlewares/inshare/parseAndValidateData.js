import { number, string } from "yup";
import bcryptjs from 'bcryptjs';
import { CustomError } from "./CustomError.js";
import { uuid } from "../../utils/uuid.js";

export const parseAndValidateData = {
    createUser: async (data, id) => {

        // 1) take data
        let { timeOut, maxCandidate, password, name } = data;

        // 2) validate data
        try {
            name = await string()
                .required('Name is required')
                .validate(name);

            timeOut = await number()
                .required('TimeOut is required')
                .min(1, "Room duration can't be less than 1 minute")
                .max(30, "Room duration can't be greater than 30 minutes")
                .validate(timeOut);

            maxCandidate = await number()
                .required('TimeOut is required')
                .min(2, "Minimum allowed candidate can not be less than 2")
                .max(10, "Maximum allowed candidate can not be greater than 10")
                .validate(maxCandidate);


            password = await string()
                .validate(password);
        } catch (error) {
            throw CustomError.ValidationError(error);
        }

        // 3) create object to store
        const dataToStore = {
            name,
            timeOut: Date.now() + (timeOut * 1000 * 60),
            maxCandidate,
            password: (password && await bcryptjs.hash(password, 8)) || undefined,
            participants: [id],
            admin: [id]
        };

        return dataToStore;
    },

    joinUser: async (data) => {

        // 1) take data
        let { password, name, roomId } = data;

        // 2) validate data
        try {
            roomId = await string()
                .required('Room ID is required')
                .validate(roomId);

            name = await string()
                .required('Name is required')
                .validate(name);

            password = await string()
                .validate(password);

        } catch (error) {
            throw CustomError.ValidationError(error);
        }

        // 3) create newData
        const newData = {
            roomId,
            name,
            password
        };

        return newData;
    },

    send: async (data, user) => {
        // 1) take data
        let { type, message, s3_key, filename, size } = data;

        // 2) validate data
        try {
            type = await string()
                .required('Type is required')
                .validate(type);

            message = await string()
                .validate(message);

            s3_key = await string()
                .validate(s3_key);

            filename = await string()
                .validate(filename);

            size = await string()
                .validate(size);

        } catch (error) {
            throw CustomError.ValidationError(error);
        }

        // 3) create newData
        const newData = {
            _id: uuid(),
            type, message, s3_key, filename, size,
            from: user.name
        };

        return newData;
    },

    uploadUrl: async (data, user) => {
        // 1) take data
        let { type, size } = data;

        // 2) validate data
        try {
            type = await string()
                .validate(type);

            size = await number()
                .required('File size is required')
                .validate(size);

        } catch (error) {
            throw CustomError.ValidationError(error);
        }

        // 3) create newData
        const newData = {
            type, size
        };

        return newData;
    },
}