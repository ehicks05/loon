import {
  bigint,
  boolean,
  char,
  customType,
  doublePrecision,
  foreignKey,
  index,
  integer,
  pgTable,
  primaryKey,
  unique,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

export const loon_users = pgTable("loon_users", {
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  full_name: varchar("full_name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
});
