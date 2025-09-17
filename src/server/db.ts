import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { schema } from './drizzle/index.js';
import { env } from './env.js';
import { seed } from './seed.js';

const queryClient = postgres(env.DB_URL);
export const db = drizzle(queryClient, { schema });

seed();
