import { index, pgTable, text, uuid, vector } from "drizzle-orm/pg-core";
import { baseSchema } from "./base.schema";
import { documentSchema } from "./document.schema";

export const documentChunksSchema = pgTable('document_chunks',{
    document_id : uuid("document_id").references(() => documentSchema.id),
    content : text("content").notNull(),
    embedding: vector('embedding', { dimensions: 1536 }),
    ...baseSchema,
}, (table) => [
    index('embeddingIndex').using('hnsw', table.embedding.op('vector_cosine_ops')),
])