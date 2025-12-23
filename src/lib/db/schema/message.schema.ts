import { pgTable, text } from "drizzle-orm/pg-core";
import { baseSchema } from "./base.schema";

export const messageSchema = pgTable("messages", {
  ...baseSchema,
  message_type : text("message_type").notNull(),
  user_id     : text("user_id").notNull(),
});