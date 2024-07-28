import { miscRouter } from "./routers/misc";
import { playlistRouter } from "./routers/playlist";
import { tracksRouter } from "./routers/tracks";
import { router } from "./trpc";

export const appRouter = router({
  misc: miscRouter,
  playlist: playlistRouter,
  tracks: tracksRouter,
});

export type AppRouter = typeof appRouter;
