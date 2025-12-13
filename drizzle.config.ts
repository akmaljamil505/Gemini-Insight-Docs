import { defineConfig } from "drizzle-kit";
import { dbConfig } from "./src/config/db.config";
export default defineConfig({
    schema : "./src/lib/db/schema",
    out : "./src/lib/db/migrations",
    dialect : 'postgresql',
    dbCredentials : {
        url : dbConfig.DATABASE_URL,
    },
    migrations : {
        schema : "public",
        table : "migrations",
    }
})