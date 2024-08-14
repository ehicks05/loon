import { lastFm } from "../../services/lastfm/client.js";
import { z } from "zod";
import { publicProcedure, router } from "../trpc.js";

export const albumRouter = router({
  info: publicProcedure
    .input(z.object({ artist: z.string(), album: z.string() }))
    .query(async ({ input: { artist, album } }) => {
      if (!artist || !album) {
        return null;
      }
      return lastFm.album.getInfo({ artist, album });
    }),
});

// export type definition of API
export type AlbumRouter = typeof albumRouter;
