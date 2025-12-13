import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { dbConfig } from '../../config/db.config';
import * as schema from './schema';

const client = postgres(dbConfig.DATABASE_URL, {
    max: 10,
    idle_timeout: 30,
    connect_timeout: 5,
    max_lifetime: 60,
})

export default drizzle({ client : client, schema: schema });
