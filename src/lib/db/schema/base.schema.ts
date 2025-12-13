import { bigint, timestamp, uuid } from "drizzle-orm/pg-core";

export const baseSchema = {
    id : uuid("id").defaultRandom().primaryKey(),
    createdAt : timestamp("created_at").defaultNow().notNull(),
    updatedAt : timestamp("updated_at"),
	version: bigint({mode : 'number'}).default(Date.now()).notNull(),
}