import { z } from "zod";
import { lastFm } from "../../services/lastfm/client.js";
import { publicProcedure, router } from "../trpc.js";

export const artistRouter = router({
  info: publicProcedure
    .input(z.object({ artist: z.string() }))
    .query(async ({ input: { artist } }) => {
      if (!artist) {
        return null;
      }
      return lastFm.artist.getInfo({ artist });
    }),
});

// export type definition of API
export type ArtistRouter = typeof artistRouter;
