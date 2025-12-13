import BaseException from "./base.exception";
import { StatusCodes } from "http-status-codes";

export default class AuthenticationException extends BaseException {
    constructor(message: string) {
        super(message, StatusCodes.UNAUTHORIZED);
    }
}
