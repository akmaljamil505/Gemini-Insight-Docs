import { asc, eq } from "drizzle-orm";
import db from "../../lib/db";
import { messageSchema } from "../../lib/db/schema/message.schema";

export class MessageService {
    
    static async historyChatByConversationID(conversationId : string) {
        return await db.select().from(messageSchema).where(eq(messageSchema.conversation_id, conversationId)).orderBy(asc(messageSchema.createdAt));
    }

}