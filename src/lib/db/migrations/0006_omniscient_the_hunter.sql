ALTER TYPE "public"."user_role" ADD VALUE 'model';--> statement-breakpoint
CREATE TABLE "conversation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"version" bigint DEFAULT 1767067967974 NOT NULL,
	"title" varchar DEFAULT 'New Conversation' NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"version" bigint DEFAULT 1767067967974 NOT NULL,
	"conversation_id" uuid,
	"role" "user_role" NOT NULL,
	"message" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "version" SET DEFAULT 1767067967974;--> statement-breakpoint
ALTER TABLE "document_chunks" ALTER COLUMN "version" SET DEFAULT 1767067967974;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "version" SET DEFAULT 1767067967974;--> statement-breakpoint
ALTER TABLE "conversation" ADD CONSTRAINT "conversation_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversation_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversation"("id") ON DELETE no action ON UPDATE no action;