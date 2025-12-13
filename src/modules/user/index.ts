import Elysia, { t } from "elysia";
import UserModel from "./model";
import UserService from "./service";
import { WebResponse } from "../../lib/types/web-reseponse.type";
import XCorrelationIDHelper from "../../lib/helpers/x-correlation-id.helper";
import GlobalConstant from "../../lib/constant/global.constant";
import { StatusCodes } from "http-status-codes";

export const user = new Elysia({
    prefix: '/user',
})
    .post("/create", async ({ body, request, set }): Promise<WebResponse<UserModel.Response>> => {
        const user = await UserService.create(body);
        const correlationID = XCorrelationIDHelper.getXCorrelationIDFromRequest(request);
        set.status = 200;
        set.headers[GlobalConstant.X_CORRELATION_ID_HEADER] = correlationID;
        return {
            status: true,
            x_correlation_id: correlationID,
            message: 'Successfully created user',
            data: user,
            code: StatusCodes.OK,
        }
    }, {
        body: UserModel.createUserBody,
    })
    .post("/update", async ({ body, request, set }): Promise<WebResponse<UserModel.Response>> => {
        const user = await UserService.update(body);
        const correlationID = XCorrelationIDHelper.getXCorrelationIDFromRequest(request);
        set.status = 200;
        set.headers[GlobalConstant.X_CORRELATION_ID_HEADER] = correlationID;
        return {
            status: true,
            x_correlation_id: correlationID,
            message: 'Successfully updated user',
            data: user,
            code: StatusCodes.OK,
        }
    }, {
        body: UserModel.updateUserBody,
    })
    .post("/reset-password", async ({ body, request, set }): Promise<WebResponse<UserModel.Response>> => {
        const user = await UserService.resetPassword(body);
        const correlationID = XCorrelationIDHelper.getXCorrelationIDFromRequest(request);
        set.status = 200;
        set.headers[GlobalConstant.X_CORRELATION_ID_HEADER] = correlationID;
        return {
            status: true,
            x_correlation_id: correlationID,
            message: 'Successfully reset password user',
            data: user,
            code: StatusCodes.OK,
        }
    }, {
        body: UserModel.resetPasswordUserBody,
    })
    .get("/get-all", async ({ request, set, query }): Promise<WebResponse<UserModel.Response[]>> => {
        query.page = query.page || 1;
        query.limit = query.limit || 10;
        const user = await UserService.getAll(query.page, query.limit);
        const correlationID = XCorrelationIDHelper.getXCorrelationIDFromRequest(request);
        set.status = 200;
        set.headers[GlobalConstant.X_CORRELATION_ID_HEADER] = correlationID;
        return {
            status: true,
            x_correlation_id: correlationID,
            message: 'Successfully get user',
            data: user,
            code: StatusCodes.OK,
        }
    }, {
        query: t.Object({
            page: t.Numeric(),
            limit: t.Numeric(),
        })
    })
