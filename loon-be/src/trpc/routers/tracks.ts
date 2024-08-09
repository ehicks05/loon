import { asc, eq } from "drizzle-orm";
import { uint8ArrayToBase64 } from "uint8array-extras";
import { z } from "zod";
import { db } from "../../db";
import { tracks } from "../../drizzle/main";
import { getPictures } from "../../utils/metadata";
import { publicProcedure, router } from "../trpc";

export const tracksRouter = router({
  list: publicProcedure.query(async () => {
    const result = await db
      .select()
      .from(tracks)
      .orderBy(
        asc(tracks.artist),
        asc(tracks.album),
        asc(tracks.discNumber),
        asc(tracks.trackNumber),
        asc(tracks.title),
      );
    return result;
  }),
  pictures: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id } }) => {
      const track = await db.query.tracks.findFirst({
        where: eq(tracks.id, id),
      });

      if (!track || !track.path) {
        return [];
      }
      const pictures = await getPictures(track?.path);

      return pictures?.map((picture) => ({
        ...picture,
        data: undefined,
        imgSrc: `data:${picture.format};base64,${uint8ArrayToBase64(picture.data)}`,
      }));
    }),
});

// export type definition of API
export type TracksRouter = typeof tracksRouter;
