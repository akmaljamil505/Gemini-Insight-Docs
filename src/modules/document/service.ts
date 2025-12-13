import { eq } from "drizzle-orm";
import db from "../../lib/db";
import { documentSchema } from "../../lib/db/schema/document.schema";
import { documentChunksSchema } from "../../lib/db/schema/document_chunks.schema";
import Gemini from "../../lib/llm";
import SupabaseStorage from "../../lib/storage/supabase.storage";
import DocumentModel from "./model";
import NotFoundException from "../../lib/exception/not-found.exception";

export default class DocumentService {
    static async create(body : DocumentModel.CreateDocumentBody) {

          const { title, file } = body;
          const signedUrl = await SupabaseStorage.generateUploadSignedUrl(file.name);
          const filePath = await SupabaseStorage.uploadFile(file, file.name, signedUrl);
          const version = Date.now();
          const [document] = await db.insert(documentSchema).values({
            file_path : filePath,
            title : title,
            version,
          }).returning();
              const contents = [
                    { text: "Extract all text, including tables and OCR images to string." },
                    {
                         inlineData: {
                              mimeType: 'application/pdf',
                              data: Buffer.from(await file.arrayBuffer()).toString("base64")
                         }
                    }
               ];

          const response = await Gemini.generateContent(contents);
          if (!response.text) {
               throw new Error('Failed to extract text from PDF');
          }
          const chunks = this.chunkText(response.text);
          const resultEmbeddings = await Gemini.embeddingContent(chunks);
          if (!resultEmbeddings.embeddings) {
               throw new Error('Failed to generate embeddings');
          }

          if(chunks.length !== resultEmbeddings.embeddings.length) {
               throw new Error('Embeddings length does not match chunks length');
          }

          const embeddings = resultEmbeddings.embeddings;

          type NewDocumentChunk = typeof documentChunksSchema.$inferInsert;
          const documentChunks : NewDocumentChunk[] = chunks.map((chunk, index) => ({
               document_id : document.id,
               content : chunk,
               embedding : embeddings[index].values,
               version : version
          }));

          await db.insert(documentChunksSchema).values(documentChunks);
    }

    static async getSignUrlFileDocument(documentId: string) {
          const [document] = await db
               .select()
               .from(documentSchema)
               .where(eq(documentSchema.id, documentId))
               .limit(1);

          if(!document) {
               throw new NotFoundException("Document not found");
          }
          return await SupabaseStorage.generateSignedUrl(document.file_path, 60);
    }

     static async getAll(page: number, limit: number) {
          return await db
               .select()
               .from(documentSchema)
               .limit(limit)
               .offset((page - 1) * limit);
    }


     private static chunkText(text: string,chunkSize: number = 500,overlap: number = 100 ): string[] {

          if (!text || text.length === 0) {
               return [];
          }

          if (chunkSize <= 0) {
          throw new Error('chunkSize harus lebih besar dari 0');
          }

          if (overlap < 0) {
          throw new Error('overlap tidak boleh negatif');
          }

          if (overlap >= chunkSize) {
          throw new Error('overlap harus lebih kecil dari chunkSize');
          }

          const chunks: string[] = [];
          let startIndex = 0;

          while (startIndex < text.length) {
               // Ambil chunk dengan ukuran yang ditentukan
               const endIndex = Math.min(startIndex + chunkSize, text.length);
               const chunk = text.substring(startIndex, endIndex);
               chunks.push(chunk);

               // Jika sudah mencapai akhir teks, keluar dari loop
               if (endIndex >= text.length) {
                    break;
               }

               // Geser startIndex dengan memperhitungkan overlap
               startIndex += chunkSize - overlap;
          }
          return chunks;
     }
}
