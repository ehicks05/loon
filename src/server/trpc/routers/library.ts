import { eq } from "drizzle-orm";
import { uint8ArrayToBase64 } from "uint8array-extras";
import { z } from "zod";
import { db } from "../../../../src/server/db.js";
import { tracks as tracksTable } from "../../../../src/server/drizzle/main.js";
import { fetchLibrary } from "../../services/library/fetch.js";
import { getPictures } from "../../services/library/metadata.js";
import { publicProcedure, router } from "../trpc.js";

export const libraryRouter = router({
  list: publicProcedure.query(async () => {
    return fetchLibrary();
  }),
  pictures: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input: { id } }) => {
      const track = await db.query.tracks.findFirst({
        where: eq(tracksTable.id, id),
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
export type LibraryRouter = typeof libraryRouter;
