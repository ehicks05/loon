import type { TrackInput } from "../types";
import { cloudinary } from "./client";

export const checkExistence = async (publicId: string) => {
  const imageSize = await cloudinary.uploader.explicit(publicId);
  return imageSize !== 0;
};

const getPublicImageIds = ({ artist, album }: TrackInput) => ({
  artistImageId: `art/${artist}/${artist}`,
  albumImageId: `art/${artist}/albums/${album}`,
});

export const syncImagesCloudinary = async (track: TrackInput) => {
  // do we already have the images?
  const { artistImageId, albumImageId } = getPublicImageIds(track);
  const artistImageExists = await checkExistence(artistImageId);
  const albumImageExists = await checkExistence(albumImageId);

  if (artistImageExists && albumImageExists) {
    return;
  }

  // if not, determine where they're coming from

  // artist image source priority: embedded
};
