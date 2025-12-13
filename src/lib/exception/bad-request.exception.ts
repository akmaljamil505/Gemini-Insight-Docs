import BaseException from "./base.exception";

import { StatusCodes } from "http-status-codes";

export default class BadRequestException extends BaseException {
    constructor(message: string) {
        super(message, StatusCodes.BAD_REQUEST);
    }
}