import { randomUUIDv7 } from "bun";
import GlobalConstant from "../constant/global.constant";

export default class XCorrelationIDHelper {

    static generateCorrelationID() : string {
        return randomUUIDv7();
    }

    static getXCorrelationIDFromRequest(request : Request) : string {
        return request.headers.get(GlobalConstant.X_CORRELATION_ID_HEADER) || XCorrelationIDHelper.generateCorrelationID();
    }

    static setXCorrelationIDToRequest(request : Request, correlationID : string) : void {
        request.headers.set(GlobalConstant.X_CORRELATION_ID_HEADER, correlationID);
    }

}