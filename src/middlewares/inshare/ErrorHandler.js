import { CustomError } from "./CustomError.js";

export function ErrorHandler(error, cb) {
    let data = {
        status: 'ERROR',
        message: 'Something went wrong !'
    }

    if (error instanceof CustomError) {
        data.type = error.type;
        data.message = error.message;
    } else {
        console.log(error);
    }
    cb(data);
}