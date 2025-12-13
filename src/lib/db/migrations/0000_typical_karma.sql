CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "documents" (
	"file_path" varchar NOT NULL,
	"title" varchar NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"version" integer DEFAULT 276 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_chunks" (
	"document_id" uuid,
	"content" text NOT NULL,
	"embedding" vector(1536),
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"version" integer DEFAULT 276 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"role" "user_role" NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"version" integer DEFAULT 276 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "document_chunks" ADD CONSTRAINT "document_chunks_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "embeddingIndex" ON "document_chunks" USING hnsw ("embedding" vector_cosine_ops) WITH(m=32, ef_construction=200) ; --> statement-breakpoint
CREATE UNIQUE INDEX "email_index_unique" ON "users" USING btree ("email");