import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./drizzle/lucia.ts", "./drizzle/main.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL || "",
  },
  verbose: true,
  strict: true,
});
