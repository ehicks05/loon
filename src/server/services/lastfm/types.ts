import { z } from "zod";

export const ArtistInfoSchema = z.object({
  artist: z.object({
    stats: z.object({
      listeners: z.string(),
      playcount: z.string(),
    }),
    bio: z.object({
      published: z.string(),
      summary: z.string(),
      content: z.string(),
    }),
  }),
});

export const AlbumInfoSchema = z.object({
  album: z.object({
    listeners: z.string(),
    playcount: z.string(),
    tracks: z.object({ track: z.array(z.object({ name: z.string() })) }),
    wiki: z.object({
      published: z.string(),
      summary: z.string(),
      content: z.string(),
    }),
  }),
});
