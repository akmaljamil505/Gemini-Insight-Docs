import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { userSchema } from "./user.schema";

export const sessionSchema = pgTable("session", {
    id : uuid("id").defaultRandom().primaryKey(),
    userId : uuid("user_id").references(() => userSchema.id).notNull(),
    expiresAt : timestamp("expires_at").notNull(),
    refreshToken : varchar("refresh_token").notNull(),
    createdAt : timestamp("created_at").defaultNow().notNull(),
})

