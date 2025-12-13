ALTER TABLE "documents" ALTER COLUMN "version" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "version" SET DEFAULT 1764563588407;--> statement-breakpoint
ALTER TABLE "document_chunks" ALTER COLUMN "version" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "document_chunks" ALTER COLUMN "version" SET DEFAULT 1764563588407;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "version" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "version" SET DEFAULT 1764563588407;