import { asc, eq } from "drizzle-orm";
import db from "../../lib/db";
import { messageSchema } from "../../lib/db/schema/message.schema";
import { conversationSchema } from "../../lib/db/schema/conversation.schema";
import NotFoundException from "../../lib/exception/not-found.exception";
import ForbiddenException from "../../lib/exception/forbidden.exception";

export class MessageService {
    
    static async historyChatByConversationID(conversationId : string, userId? : string) {
        const [conversation] = await db.select().from(conversationSchema).where(eq(conversationSchema.id, conversationId)).limit(1);
        if (!conversation) {
            throw new NotFoundException("Conversation not found");
        }
        
        if (userId && conversation.user_id !== userId) {
            throw new ForbiddenException("You do not have access to this conversation");
        }
        return await db.select().from(messageSchema).where(eq(messageSchema.conversation_id, conversationId)).orderBy(asc(messageSchema.createdAt));
    }

}