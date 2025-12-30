import { Context } from "elysia";
import { CommonJWTPayload } from "./jwt.type";

export interface CustomContext extends Context {
    user : CommonJWTPayload
}