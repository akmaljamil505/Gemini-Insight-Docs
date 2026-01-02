import Elysia from "elysia";
import ChatModel from "./model";
import ChatService from "./service";
import { CustomContext } from "../../lib/types/custom-context.type";
import AuthenticationException from "../../lib/exception/authentication.exception";
import { user } from "../user";
import JwtHelper from "../../lib/helpers/jwt.helper";
import { CommonJWTPayload } from "../../lib/types/jwt.type";

export const chatSocket = new Elysia({
})
    .ws('/socket', {
        body: ChatModel.chatRequest,
        async message(ws) {
            const { body, data } = ws;
            try 
            {
                if(!data.request.headers.get('Authorization')) throw new AuthenticationException("Authorization header is missing");
                const token = data.request.headers.get('Authorization')!.split(' ')[1];
                if(!token) throw new AuthenticationException("Token is missing");
                const verify = JwtHelper.verifyToken(token) as CommonJWTPayload;
                const response = await ChatService.generateChatWithGemini(body, verify.id);
                ws.send({
                    message: response,
                    time: Date.now()
                })
            } 
            catch (error : Error | any) 
            {
                ws.send({
                    message: error.message || "An error occurred",
                    time: Date.now()
                })
            }

        }
    })

