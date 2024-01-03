import { errorTypesEnum } from "../../../constants.js";

export class CustomError extends Error {
    constructor(type, message) {
        super();
        this.type = type;
        this.message = message;
    }
    static ValidationError = (error) => {
        return new CustomError(errorTypesEnum.VALIDATION_ERROR, error.message);
    }
    static PasswordRequired = (message) => {
        return new CustomError(errorTypesEnum.PASSWORD_REQUIRED, 'Room is Password Protected');
    }
    static PasswordWrong = (message) => {
        return new CustomError(errorTypesEnum.INVALID_PASSWORD, 'Password is wrong');
    }
    static PolicyViolate = (message) => {
        return new CustomError(errorTypesEnum.POLICY_VIOLATE, message);
    }
}