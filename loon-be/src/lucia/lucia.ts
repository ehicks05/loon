import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

import { db } from "../db.js";
import { sessionTable, userTable } from "../drizzle/lucia.js";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => ({
    githubId: attributes.githubId,
    username: attributes.username,
    isAdmin: attributes.isAdmin,
  }),
});

interface DatabaseUserAttributes {
  githubId: number;
  username: string;
  isAdmin: boolean;
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
