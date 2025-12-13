import { t } from "elysia";
import { CommonJWTPayload } from "../../lib/types/jwt.type";

namespace AuthModel {

    export const signInBody = t.Object({
        email: t.String({
            format: "email",
            error: "Invalid email format",
        }),
        password: t.String({
            error: "Password is required",
        }),
    })

    export const refreshTokenBody = t.Object({
        refreshToken: t.String({
            error: "Refresh token is required, must be 64 characters long",
            maxLength: 64,
            minLength: 64,
        }),
    })

    export type SignInBody = typeof signInBody.static;
    export type RefreshTokenBody = typeof refreshTokenBody.static;

    export type SignInResponse = {
        access_token: string;
        refresh_token: string;
        user: CommonJWTPayload;
    }

    export type RefreshTokenResponse = {
        access_token: string;
    }

}

export default AuthModel;