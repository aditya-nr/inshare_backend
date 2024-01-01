import dotenv from "dotenv";
dotenv.config({ path: './.env' });

const {
    DB_NAME,
    DB_URL,
    PORT,
    CORS_ORIGIN,
    PASSWORD_SALT,
    AWS_S3_KEY_ID,
    AWS_S3_KEY,
    AWS_S3_REGION,
    AWS_S3_BUCKET,
} = process.env;

export const env = {
    DB_NAME,
    DB_URL,
    PORT,
    CORS_ORIGIN: CORS_ORIGIN.split(';').map(e => e.trim()),
    PASSWORD_SALT,
    AWS_S3_KEY_ID,
    AWS_S3_KEY,
    AWS_S3_REGION,
    AWS_S3_BUCKET,
}

export const inshareEventEnum = {
    JOIN_ROOM: "join-room",
    CREATE_ROOM: "create-room",
    MESSAGE: "message",
    NOTIFICATION: "notification",
    GET_UPLOAD_URL: "get-upload-url",
    TIMEOUT: "timeout"
}
export const errorTypesEnum = {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    PASSWORD_REQUIRED: "PASSWORD_REQUIRED",
    POLICY_VIOLATE: "POLICY_VIOLATE",
    INVALID_ROOMID: "INVALID_ROOMID",
    INVALID_PASSWORD: "INVALID_PASSWORD",
}