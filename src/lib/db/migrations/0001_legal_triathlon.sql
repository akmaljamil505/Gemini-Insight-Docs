ALTER TABLE "documents" ALTER COLUMN "version" SET DEFAULT 530;--> statement-breakpoint
ALTER TABLE "document_chunks" ALTER COLUMN "version" SET DEFAULT 530;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "version" SET DEFAULT 530;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "name" varchar NOT NULL;