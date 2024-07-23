import { miscRouter } from "./misc";
import { playlistRouter } from "./playlist";
import { router } from "./trpc";

export const appRouter = router({
  playlist: playlistRouter,
  misc: miscRouter,
});

export type AppRouter = typeof appRouter;
