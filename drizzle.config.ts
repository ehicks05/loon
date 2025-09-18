import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/drizzle/main.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
  verbose: true,
  strict: true,
});
