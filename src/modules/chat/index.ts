import Elysia, { t } from "elysia"
import ChatModel from "./model"
import ChatService from "./service";

export const chat = new Elysia({
})
    .ws('/ws', {
        body: ChatModel.chatRequest,
        async message(ws, { message }) {
            const response = await ChatService.generateChatWithGemini({ message });
            ws.send({
                message: response,
                time: Date.now()
            })
        }
    })