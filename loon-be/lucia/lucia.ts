import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { db } from "../db";

export const userTable = pgTable("user", {
  id: text("id").primaryKey(),
  githubId: integer("github_id").unique(),
  username: text("username").notNull(),
});

export const sessionTable = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
  }
}
