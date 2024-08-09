import { miscRouter } from "./routers/misc";
import { playlistRouter } from "./routers/playlist";
import { systemRouter } from "./routers/system";
import { tracksRouter } from "./routers/tracks";
import { router } from "./trpc";

export const appRouter = router({
  misc: miscRouter,
  playlist: playlistRouter,
  system: systemRouter,
  tracks: tracksRouter,
});

export type AppRouter = typeof appRouter;
