import { miscRouter } from "./routers/misc.js";
import { playlistRouter } from "./routers/playlist.js";
import { systemRouter } from "./routers/system.js";
import { tracksRouter } from "./routers/tracks.js";
import { router } from "./trpc.js";

export const appRouter = router({
  misc: miscRouter,
  playlist: playlistRouter,
  system: systemRouter,
  tracks: tracksRouter,
});

export type AppRouter = typeof appRouter;
