import { eq } from "drizzle-orm";
import db from "../../lib/db";
import { conversationSchema } from "../../lib/db/schema/conversation.schema";
import ConversationModel from "./model";
import NotFoundException from "../../lib/exception/not-found.exception";
import ConflictException from "../../lib/exception/conflict.exception";
import { messageSchema } from "../../lib/db/schema/message.schema";

export default class ConversationService {


    static async createConversation(model : ConversationModel.CreateConversation, userId : string) {
        const [data] = await db.insert(conversationSchema).values({
            title: model.title,
            user_id : userId
        }).returning(); 
        return data;
    }

    static async updateConversation(model : ConversationModel.UpdateConversation, userId : string) {
       return await db.transaction(async (tx) => {
            const [conversation] = await tx.select().from(conversationSchema).where(eq(conversationSchema.id, model.id)).for('update');
            if(!conversation) {
                throw new NotFoundException('Conversation not found');
            }

            if(conversation.user_id !== userId) {
                throw new ConflictException('You do not have permission to update this conversation');
            }

            if(conversation.version !== model.version) {
                throw new ConflictException('Version mismatch');
            }

            const [updatedConversation] = await tx.update(conversationSchema).set({
                title: model.title,
                version: Date.now()
            }).where(eq(conversationSchema.id, model.id)).returning();
            return updatedConversation;
       }) 
    }

    static async deleteConversation(model : ConversationModel.DeleteConversation, userId : string) {
       await db.transaction(async (tx) => {
            const [conversation] = await tx.select().from(conversationSchema).where(eq(conversationSchema.id, model.id)).for('update');
            if(!conversation) {
                throw new NotFoundException('Conversation not found');
            }

            if(conversation.user_id !== userId) {
                throw new ConflictException('You do not have permission to update this conversation');
            }

            if(conversation.version !== model.version) {
                throw new ConflictException('Version mismatch');
            }
            await tx.delete(messageSchema).where(eq(messageSchema.conversation_id, model.id));
            return await tx.delete(conversationSchema).where(eq(conversationSchema.id, model.id));
       })
    }

    static async listByUserID(userId : string) {
        return await db.select().from(conversationSchema).where(eq(conversationSchema.user_id, userId));
    }

}