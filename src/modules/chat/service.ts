import { cosineDistance, gt, inArray, sql } from "drizzle-orm";
import { documentChunksSchema } from "../../lib/db/schema/document_chunks.schema";
import db from "../../lib/db";
import ChatModel from "./model";
import Gemini from "../../lib/llm";
import { documentSchema } from "../../lib/db/schema/document.schema";

export default class ChatService {

     static async generateChatWithGemini(body : ChatModel.ChatRequest) {
          const embedding = await Gemini.embeddingContent(body.message, 'RETRIEVAL_QUERY');
          if(!embedding || !embedding.embeddings) {
            throw new Error("Failed to generate embedding");
          }
          const embeddingVector = embedding.embeddings[0];
          if(!embeddingVector || !embeddingVector.values) {
            throw new Error("Failed to generate embedding vector");
          }
          const similarity = sql<number>`1 - (${cosineDistance(documentChunksSchema.embedding, embeddingVector.values)})`;
          const documentsChunks = await db
               .select()
               .from(documentChunksSchema)
               .where(gt(similarity, 0.5))
               .orderBy(similarity)
               .limit(20)

          const documentIds = documentsChunks.map((doc) => doc.document_id).filter((id) => id !== undefined);
          const documents = await db
            .select()
            .from(documentSchema)
            .where(
              inArray(
                documentSchema.id,
                documentIds.filter((id): id is string => id !== null)
              )
            );
          const chat = Gemini.generateChat();

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
               }
          });
          
          const responseText = response.text;

          if(!responseText) {
            throw new Error("Failed to generate response");
          }
          console.log("Received response from Chat Gemini");
          return JSON.parse(responseText);
    }

}