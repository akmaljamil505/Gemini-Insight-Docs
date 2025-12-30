import { t } from "elysia";

namespace ConversationModel {

    export const createConversation = t.Object({
        title: t.Optional(t.String()),
    })
    
    export const updateConversation = t.Object({
        id: t.String(),
        title: t.Optional(t.String()),
        version: t.Number()
    })

    export const deleteConversation = t.Object({
        id: t.String(),
        version: t.Number()
    })

    export type CreateConversation = typeof createConversation.static;
    export type UpdateConversation = typeof updateConversation.static;
    export type DeleteConversation = typeof deleteConversation.static;

}

export default ConversationModel;