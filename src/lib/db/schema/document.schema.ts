import { pgTable, varchar } from "drizzle-orm/pg-core";

import { baseSchema } from "./base.schema";

export const documentSchema = pgTable('documents',{
    file_path : varchar("file_path").notNull(),
    title : varchar("title").notNull(),
    ...baseSchema,
})