import type { Image, ItemTypes } from "@spotify/web-api-ts-sdk";
import { spotify } from "./client";

export type LoonItemTypes = Extract<ItemTypes, "artist" | "album">;

const imageCache: Record<LoonItemTypes, Record<string, Image[]>> = {
  artist: {},
  album: {},
};

const toFullAndThumb = (images: Image[]) => ({
  full: images[0] || "",
  thumb: images.length > 1 ? images[1] : images[0] || "",
});

export const fetchImages = async ({
  q,
  itemType,
}: { q: string; itemType: LoonItemTypes }) => {
  const cachedResult = imageCache[itemType][q];
  if (cachedResult) {
    return toFullAndThumb(cachedResult);
  }

  const result = await spotify.search(q, [itemType]);
  const resultEntity =
    itemType === "artist" ? result.artists.items[0] : result.albums.items[0];
  if (!resultEntity) {
    console.log(`unable to find ${itemType} ${q}`);
  }

  const images = resultEntity?.images || [];
  if (images.length === 0) {
    console.log(`unable to find images for ${itemType} ${q}`);
  }

  imageCache[itemType][q] = images;

  return toFullAndThumb(images);
};
