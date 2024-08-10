import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { seed } from "./seed.js";
import { schema } from "./drizzle/index.js";
import { env } from "./env.js";

const queryClient = postgres(env.DB_URL);
export const db = drizzle(queryClient, { schema });

seed();
