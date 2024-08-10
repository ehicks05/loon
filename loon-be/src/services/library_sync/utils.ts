import type { TrackInput } from "../types.js";

export const omitImageFields = (track: TrackInput) => {
  const {
    spotifyArtistImage,
    spotifyArtistImageThumb,
    spotifyAlbumImage,
    spotifyAlbumImageThumb,
    ...rest
  } = track;
  return rest;
};
