import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "./drizzle";
import { env } from "./env";
import { seed } from "./seed";

const queryClient = postgres(env.DB_URL);
export const db = drizzle(queryClient, { schema });

seed();
