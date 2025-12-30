import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { baseSchema } from "./base.schema";
import { conversationSchema } from "./conversation.schema";
import { roleEnum } from "./user.schema";

export const messageSchema = pgTable("messages", {
  ...baseSchema,
  conversation_id : uuid("conversation_id").references(() => conversationSchema.id),
  role : roleEnum().notNull(),
  message : text("message").notNull(),
});