import Elysia from "elysia";
import XCorrelationIDHelper from "../helpers/x-correlation-id.helper";
import { WebResponse } from "../types/web-reseponse.type";
import { StatusCodes } from "http-status-codes";
import { APP_CONFIG } from "../../config/app.config";
import BaseException from "../exception/base.exception";
import { DrizzleQueryError } from "drizzle-orm";
import DB_CONSTANT from "../constant/db.constant";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import LoggerHelper from "../helpers/logger.helper";

const globalHandlingErrorPlugin = (app: Elysia) => app
    .error({
        BaseException: BaseException,
        DrizzleQueryError: DrizzleQueryError,
        JsonWebTokenError: JsonWebTokenError,
    })
    .onError(({ request, set, error, code }) => {

        set.status = StatusCodes.INTERNAL_SERVER_ERROR;
        let response: WebResponse<any> = {
            status: false,
            message: error instanceof Error && APP_CONFIG.NODE_ENV === "development" ? error.message : "Internal Server Error",
            data: null,
            x_correlation_id: XCorrelationIDHelper.getXCorrelationIDFromRequest(request),
            code: StatusCodes.INTERNAL_SERVER_ERROR,
        }

        switch (code) {
            case "NOT_FOUND":
                set.status = StatusCodes.NOT_FOUND;
                response.message = "Route Not Found";
                response.code = StatusCodes.NOT_FOUND;
                break;
            case "JsonWebTokenError":
                set.status = StatusCodes.UNAUTHORIZED;
                response.message = error instanceof TokenExpiredError ? "Token expired" : "Invalid token";
                response.code = StatusCodes.UNAUTHORIZED;
                break;
            case "DrizzleQueryError":
                const isConflict = (error?.cause as any).code ? (error?.cause as any).code === "23505" : false;
                set.status = isConflict ? StatusCodes.CONFLICT : StatusCodes.INTERNAL_SERVER_ERROR;
                if (isConflict && (error?.cause as any).constraint_name === DB_CONSTANT.EMAIL_INDEX_UNIQUE) {
                    response.message = "Email already registered";
                    response.code = StatusCodes.CONFLICT;
                }
                break;
            case "BaseException":
                set.status = error.getHttpStatus();
                response.message = error.message;
                response.code = error.getHttpStatus();
                response.data = error.getData();
                break;
            case "VALIDATION":
                set.status = StatusCodes.BAD_REQUEST;
                response.message = ('schema' in error.all?.[0] ? error.all[0].schema?.error : undefined)
                    || (error.all?.[0] as any)?.message
                    || "Validation error";
                response.code = StatusCodes.BAD_REQUEST;
                response.data = error.all;
                break;
            case "PARSE":
                set.status = StatusCodes.BAD_REQUEST;
                response.message = "Malformed request";
                response.code = StatusCodes.BAD_REQUEST;
                break;
            case "INVALID_FILE_TYPE":
                set.status = StatusCodes.BAD_REQUEST;
                response.message = "Invalid file type";
                response.code = StatusCodes.BAD_REQUEST;
                break;
            default:
                set.status = StatusCodes.INTERNAL_SERVER_ERROR;
                response.message = APP_CONFIG.NODE_ENV === "development" && error instanceof Error ? error.message : "Internal Server Error";
                response.code = StatusCodes.INTERNAL_SERVER_ERROR;
                break;
        }

        return response;
    })

export default globalHandlingErrorPlugin;
