import { StatusCodes } from "http-status-codes";
import BaseException from "./base.exception";

export default class NotFoundException extends BaseException {
    constructor(message : string = 'Not Found') {
        super(message, StatusCodes.NOT_FOUND);
    }
}