import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { userSchema } from "./user.schema";
import { baseSchema } from "./base.schema";

export const conversationSchema = pgTable("chat", {
    ...baseSchema,
    title : varchar("title").notNull().default("New Conversation"),
    user_id : uuid("user_id").references(() => userSchema.id),
})
