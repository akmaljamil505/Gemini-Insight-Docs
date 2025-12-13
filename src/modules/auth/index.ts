import Elysia from "elysia";
import AuthModel from "./model";
import AuthService from "./service";
import { WebResponse } from "../../lib/types/web-reseponse.type";
import XCorrelationIDHelper from "../../lib/helpers/x-correlation-id.helper";
import { StatusCodes } from "http-status-codes";

export const auth = new Elysia({
    prefix: "/auth",
})
    .post("/sign-in", async ({ body, set, request }): Promise<WebResponse<AuthModel.SignInResponse>> => {
        set.status = 200;
        const signInResponse = await AuthService.signIn(body);
        return {
            status: true,
            x_correlation_id: XCorrelationIDHelper.getXCorrelationIDFromRequest(request),
            message: "Sign in success",
            data: signInResponse,
            code: StatusCodes.OK,
        };
    }, {
        body: AuthModel.signInBody,
    })
    .post("/refresh-token", async ({ body, set, request }): Promise<WebResponse<AuthModel.RefreshTokenResponse>> => {
        set.status = 200;
        const refreshTokenResponse = await AuthService.refreshToken(body);
        return {
            status: true,
            x_correlation_id: XCorrelationIDHelper.getXCorrelationIDFromRequest(request),
            message: "Refresh token success",
            data: refreshTokenResponse,
            code: StatusCodes.OK,
        };
    }, {
        body: AuthModel.refreshTokenBody,
    })
