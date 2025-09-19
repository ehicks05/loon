import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../env';
import schema from './schema';
import { seed } from './seed';

const queryClient = postgres(env.DATABASE_URL);
export const db = drizzle(queryClient, { schema });

seed();
