import { StatusCodes } from "http-status-codes";

export default class BaseException extends Error {
    
    private httpStatus : StatusCodes;
    private data : any = null; 

    constructor(message: string, httpStatus : StatusCodes, data : any = null) {
        super(message);
        this.httpStatus = httpStatus;
        this.data = data;
    }

    getHttpStatus() : StatusCodes {
        return this.httpStatus;
    }

    getData() : any {
        return this.data;
    }

}