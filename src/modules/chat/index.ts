import Elysia from "elysia";
import ChatModel from "./model";
import ChatService from "./service";
import { CustomContext } from "../../lib/types/custom-context.type";

export const chatSocket = new Elysia({
})
    .ws('/socket', {
        body: ChatModel.chatRequest,
        async message(ws) {
            const {body, user} = ws as unknown as CustomContext & {body: ChatModel.ChatRequest};
            const response = await ChatService.generateChatWithGemini(body, user?.id);
            ws.send({
                message: response,
                time: Date.now()
            })
        }
    })

