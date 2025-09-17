import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./src/drizzle/lucia.ts", "./src/drizzle/main.ts"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL || "",
  },
  verbose: true,
  strict: true,
});
