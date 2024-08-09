import type { TrackInput } from "../types";

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
