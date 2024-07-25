import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { schema } from "./drizzle";
import { system_settings } from "./drizzle/main";
import { env } from "./env";

// for migrations
const migrationClient = postgres(env.DB_URL, { max: 1 });
// migrate(drizzle(migrationClient), ...)

// for query purposes
const queryClient = postgres(env.DB_URL);
export const db = drizzle(queryClient, { schema });

const seed = async () => {
  console.log("seeding");
  const systemSettingsRows = (
    await db.select({ count: count() }).from(system_settings)
  )[0].count;
  if (systemSettingsRows === 0) {
    console.log("..creating system_settings table");
    await db.insert(system_settings).values({});
  }
  console.log("done");
};

seed();
