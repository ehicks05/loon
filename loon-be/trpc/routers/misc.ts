import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../db";
import { userTable } from "../../drizzle/lucia";
import { system_settings } from "../../drizzle/main";
import { adminProcedure, publicProcedure, router } from "../trpc";

export const miscRouter = router({
  health: publicProcedure.query(() => "ok"),
  me: publicProcedure.query(({ ctx }) => {
    return ctx.user;
  }),

  systemSettings: adminProcedure.query(async () => {
    return db.query.system_settings.findFirst();
  }),

  setSystemSettings: adminProcedure
    .input(
      z.object({
        dataFolder: z.string(),
        lastFmApiKey: z.string(),
        musicFolder: z.string(),
        spotifyClientId: z.string(),
        spotifyClientSecret: z.string(),
        transcodeFolder: z.string(),
        transcodeQuality: z.string(),
        watchFiles: z.boolean(),
      }),
    )
    .mutation(async ({ input }) => {
      const systemSettings = (
        await db.update(system_settings).set(input).returning()
      )[0];
      return systemSettings;
    }),

  users: adminProcedure.query(async () => {
    const users = await db.query.userTable.findMany();
    return users.map((user) => ({
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    }));
  }),
  deleteUser: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id } }) => {
      const deletedUser = await db
        .delete(userTable)
        .where(eq(userTable.id, id));
      return deletedUser;
    }),
  updateUser: adminProcedure
    .input(z.object({ id: z.string(), isAdmin: z.boolean() }))
    .mutation(async ({ input: { id, isAdmin } }) => {
      const updatedUser = await db
        .update(userTable)
        .set({ isAdmin })
        .where(eq(userTable.id, id));
      return updatedUser;
    }),
});

// export type definition of API
export type MiscRouter = typeof miscRouter;
