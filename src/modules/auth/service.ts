import { eq } from "drizzle-orm";
import db from "../../lib/db";
import AuthModel from "./model";
import { userSchema } from "../../lib/db/schema/user.schema";
import AuthenticationException from "../../lib/exception/authentication.exception";
import HashHelper from "../../lib/helpers/hash.helper";
import JwtHelper from "../../lib/helpers/jwt.helper";
import { CommonJWTPayload } from "../../lib/types/jwt.type";
import { JWT_CONFIG } from "../../config/jwt.config";
import { sessionSchema } from "../../lib/db/schema/session.schema";

export default class AuthService {

    static async signIn(body: AuthModel.SignInBody): Promise<AuthModel.SignInResponse> {
        const { access_token, refresh_token, user } = await db.transaction(async (trx) => {

            db.select().from(userSchema).where(eq(userSchema.email, body.email)).for('update');

            const [user] = await trx.select().from(userSchema).where(eq(userSchema.email, body.email));
            if (!user) {
                throw new AuthenticationException("Wrong email or password");
            }

            const isPasswordValid = await Bun.password.verify(body.password, user.password);
            if (!isPasswordValid) {
                throw new AuthenticationException("Wrong email or password");
            }

            const jwtPayload: CommonJWTPayload = {
                email: user.email,
                name: user.name,
                role: user.role,
            }

            await trx.delete(sessionSchema).where(eq(sessionSchema.userId, user.id));

            const access_token = JwtHelper.generateToken(jwtPayload);
            const refresh_token = HashHelper.generateUniqueHash();
            await trx.insert(sessionSchema).values({
                userId: user.id,
                expiresAt: new Date(Date.now() + JWT_CONFIG.JWT_REFRESH_EXPIRES_IN * 1000),
                refreshToken: refresh_token,
            })
            return {
                access_token,
                refresh_token,
                user: jwtPayload
            }
        })
        return {
            access_token,
            refresh_token,
            user: user
        };
    }

    static async refreshToken(body: AuthModel.RefreshTokenBody): Promise<AuthModel.RefreshTokenResponse> {
        const { access_token } = await db.transaction(async (trx) => {
            const [session] = await trx.select().from(sessionSchema).where(eq(sessionSchema.refreshToken, body.refreshToken));
            if (!session) {
                throw new AuthenticationException("Wrong refresh token");
            }

            const [user] = await trx.select().from(userSchema).where(eq(userSchema.id, session.userId));
            if (!user) {
                throw new AuthenticationException("User not found");
            }

            if (session.expiresAt < new Date()) {
                throw new AuthenticationException("Session refresh token expired");
            }

            const jwtPayload: CommonJWTPayload = {
                email: user.email,
                name: user.name,
                role: user.role,
            }

            const access_token = JwtHelper.generateToken(jwtPayload);

            return {
                access_token,
            }
        })
        return {
            access_token,
        };
    }



}