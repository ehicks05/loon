import { albumRouter } from "./routers/album.js";
import { artistRouter } from "./routers/artist.js";
import { miscRouter } from "./routers/misc.js";
import { playlistRouter } from "./routers/playlist.js";
import { systemRouter } from "./routers/system.js";
import { tracksRouter } from "./routers/tracks.js";
import { router } from "./trpc.js";

export const appRouter = router({
  album: albumRouter,
  artist: artistRouter,
  misc: miscRouter,
  playlist: playlistRouter,
  system: systemRouter,
  tracks: tracksRouter,
});

export type AppRouter = typeof appRouter;
