import { t } from "elysia";

namespace ChatModel {

     export const chatRequest = t.Object({
          message: t.String(),
         conversation_id: t.String(),
     })

     export type ChatRequest = typeof chatRequest.static;
}

export default ChatModel