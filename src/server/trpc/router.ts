import { albumRouter } from "./routers/album.js";
import { artistRouter } from "./routers/artist.js";
import { libraryRouter } from "./routers/library.js";
import { miscRouter } from "./routers/misc.js";
import { playlistRouter } from "./routers/playlist.js";
import { systemRouter } from "./routers/system.js";
import { router } from "./trpc.js";

export const appRouter = router({
  album: albumRouter,
  artist: artistRouter,
  misc: miscRouter,
  playlist: playlistRouter,
  system: systemRouter,
  library: libraryRouter,
});

export type AppRouter = typeof appRouter;
