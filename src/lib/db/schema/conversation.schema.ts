import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { baseSchema } from "./base.schema";
import { userSchema } from "./user.schema";

export const conversationSchema = pgTable("conversation", {
    ...baseSchema,
    title : varchar("title").notNull().default("New Conversation"),
    user_id : uuid("user_id").references(() => userSchema.id).notNull(),
})
