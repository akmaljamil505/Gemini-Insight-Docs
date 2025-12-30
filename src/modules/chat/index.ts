import Elysia from "elysia";
import ChatModel from "./model";
import ChatService from "./service";

export const chatSocket = new Elysia({
})
    .ws('/socket', {
        body: ChatModel.chatRequest,
        async message(ws, { message, conversation_id }) {
            const response = await ChatService.generateChatWithGemini({ message, conversation_id });
            ws.send({
                message: response,
                time: Date.now()
            })
        }
    })

