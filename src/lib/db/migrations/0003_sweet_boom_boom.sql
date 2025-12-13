CREATE TABLE "session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"expires_at" timestamp NOT NULL,
	"refresh_token" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "version" SET DEFAULT 1764577138223;--> statement-breakpoint
ALTER TABLE "document_chunks" ALTER COLUMN "version" SET DEFAULT 1764577138223;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "version" SET DEFAULT 1764577138223;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;