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
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  id: bigint("id", { mode: "number" }).primaryKey().notNull(),
  full_name: varchar("full_name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }).notNull(),
});

export const loon_roles = pgTable(
  "loon_roles",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint("id", { mode: "number" }).primaryKey().notNull(),
    role: varchar("role", { length: 255 }).notNull(),
  },
  (table) => {
    return {
      uk_h1mqq0tbxl1hvc4bnkwde9ik9: unique("uk_h1mqq0tbxl1hvc4bnkwde9ik9").on(
        table.role,
      ),
    };
  },
);

export const user_roles = pgTable(
  "user_roles",
  {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    user_id: bigint("user_id", { mode: "number" })
      .notNull()
      .references(() => loon_users.id),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    role_id: bigint("role_id", { mode: "number" })
      .notNull()
      .references(() => loon_roles.id),
  },
  (table) => {
    return {
      user_roles_pkey: primaryKey({
        columns: [table.user_id, table.role_id],
        name: "user_roles_pkey",
      }),
    };
  },
);

export const spring_session = pgTable(
  "spring_session",
  {
    primary_id: char("primary_id", { length: 36 }).primaryKey().notNull(),
    session_id: char("session_id", { length: 36 }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    creation_time: bigint("creation_time", { mode: "number" }).notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    last_access_time: bigint("last_access_time", { mode: "number" }).notNull(),
    max_inactive_interval: integer("max_inactive_interval").notNull(),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    expiry_time: bigint("expiry_time", { mode: "number" }).notNull(),
    principal_name: varchar("principal_name", { length: 100 }),
  },
  (table) => {
    return {
      ix1: uniqueIndex("spring_session_ix1").using("btree", table.session_id),
      ix2: index("spring_session_ix2").using("btree", table.expiry_time),
      ix3: index("spring_session_ix3").using("btree", table.principal_name),
    };
  },
);

const bytea = customType<{ data: string; notNull: false; default: false }>({
  dataType() {
    return "bytea";
  },
  toDriver(val) {
    let newVal = val;
    if (val.startsWith("0x")) {
      newVal = val.slice(2);
    }

    return Buffer.from(newVal, "hex");
  },
  fromDriver(val) {
    return val.toString("hex");
  },
});

export const spring_session_attributes = pgTable(
  "spring_session_attributes",
  {
    session_primary_id: char("session_primary_id", { length: 36 })
      .notNull()
      .references(() => spring_session.primary_id, { onDelete: "cascade" }),
    attribute_name: varchar("attribute_name", { length: 200 }).notNull(),
    // TODO: failed to parse database type 'bytea'
    attribute_bytes: bytea("attribute_bytes").notNull(),
  },
  (table) => {
    return {
      spring_session_attributes_pk: primaryKey({
        columns: [table.session_primary_id, table.attribute_name],
        name: "spring_session_attributes_pk",
      }),
    };
  },
);
