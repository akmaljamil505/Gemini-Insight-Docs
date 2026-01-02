import { asc, cosineDistance, eq, gt, inArray, sql } from "drizzle-orm";
import RoleConstant from "../../lib/constant/role.constant";
import db from "../../lib/db";
import { documentSchema } from "../../lib/db/schema/document.schema";
import { documentChunksSchema } from "../../lib/db/schema/document_chunks.schema";
import { messageSchema } from "../../lib/db/schema/message.schema";
import Gemini from "../../lib/llm";
import ChatModel from "./model";
import { conversationSchema } from "../../lib/db/schema/conversation.schema";
import NotFoundException from "../../lib/exception/not-found.exception";
import ForbiddenException from "../../lib/exception/forbidden.exception";

export default class ChatService {

     static async generateChatWithGemini(body : ChatModel.ChatRequest, userId : string) {
        const result =  await db.transaction(async (tx) => {
          const [conversation] = await tx.select().from(conversationSchema).where(eq(conversationSchema.id, body.conversation_id)).limit(1);
          if(!conversation) {
            throw new NotFoundException("Conversation not found");
          }

          if(conversation.user_id !== userId) {
              throw new ForbiddenException("You do not have access to this conversation");
          }
          const embedding = await Gemini.embeddingContent(body.message, 'RETRIEVAL_QUERY');
          if(!embedding || !embedding.embeddings) {
            throw new Error("Failed to generate embedding");
          }
          const embeddingVector = embedding.embeddings[0];
          if(!embeddingVector || !embeddingVector.values) {
            throw new Error("Failed to generate embedding vector");
          }
          const similarity = sql<number>`1 - (${cosineDistance(documentChunksSchema.embedding, embeddingVector.values)})`;
          const documentsChunks = await tx
              .select()
              .from(documentChunksSchema)
              .where(gt(similarity, 0.5))
              .orderBy(similarity)
              .limit(20)

          const documentIds = documentsChunks.map((doc) => doc.document_id).filter((id) => id !== undefined);
          const documents = await tx
            .select()
            .from(documentSchema)
            .where(
              inArray(
                documentSchema.id,
                documentIds.filter((id): id is string => id !== null)
              )
            );

          const history : {message : string, role : string}[] = await tx.select({
                message: messageSchema.message,
                role : messageSchema.role
          })
            .from(messageSchema)
            .where(eq(messageSchema.conversation_id, body.conversation_id))
            .orderBy(asc(messageSchema.createdAt));

          const historyWithParts = history.map((h) => ({
            role: h.role === RoleConstant.MODEL ? RoleConstant.MODEL : RoleConstant.USER,
            parts: [{ text: h.message }]
          }));

          await tx.insert(messageSchema).values({
            conversation_id: body.conversation_id,
            message: body.message,
            role: RoleConstant.USER
          });

          const chat = Gemini.generateChat(historyWithParts);
          console.log("Starting to Chat Gemini");
          const template = `
            You are a helpful assistant.
            You are given a question and a set of documents.
            Your task is to answer the question ONLY based on the documents.
            If the question cannot be answered based on the documents, say so.

            Return the response in JSON format:
            {
              "answer": "your textual answer here",
              "files": [
                {
                  "name": "document title",
                  "path": "the EXACT file_path from the document metadata"
                  "id": "the EXACT file_id from the document metadata"
                }
              ]
            }

            Question: ${body.message}

            Documents:
            ${documentsChunks
              .map((chunk) => {
                const doc = documents.find((d) => d.id === chunk.document_id);
                return `--- 
            Document Title: ${doc?.title || "Unknown Title"}
            File Path: ${doc?.file_path || "No Path"}
            File ID: ${doc?.id || "No ID"}
            Content: ${chunk.content}
            ---`;
              })
              .join("\n")}
            `;

          console.log("Sending message to Chat Gemini");

          const response = await chat.sendMessage({
              message: template,
              config : {
                    temperature: 0.5,
                    responseMimeType : "application/json"
              },
          });
          
          const responseText = response.text;
          if(!responseText) {
            throw new Error("Failed to generate response");
          }

          await tx.insert(messageSchema).values({
            conversation_id: body.conversation_id,
            message: responseText,
            role: RoleConstant.MODEL
          });

          console.log("Received response from Chat Gemini");
          return JSON.parse(responseText);
      }, {
        accessMode : "read write"
      });

      return result;
    }

}