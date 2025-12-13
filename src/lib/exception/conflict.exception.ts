import BaseException from "./base.exception";
import { StatusCodes } from "http-status-codes";

export default class ConflictException extends BaseException {
    constructor(message: string) {
        super(message, StatusCodes.CONFLICT);
    }
}