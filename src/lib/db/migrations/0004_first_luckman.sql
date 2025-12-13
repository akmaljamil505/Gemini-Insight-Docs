ALTER TABLE "documents" ALTER COLUMN "version" SET DEFAULT 1764595869628;--> statement-breakpoint
ALTER TABLE "document_chunks" ALTER COLUMN "version" SET DEFAULT 1764595869628;--> statement-breakpoint
ALTER TABLE "session" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "version" SET DEFAULT 1764595869628;