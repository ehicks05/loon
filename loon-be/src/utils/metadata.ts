import { createHash } from "node:crypto";
import { openAsBlob } from "node:fs";
import nodepath from "node:path";
import { parseBlob } from "music-metadata";
import type {
  AlbumArtistInput,
  AlbumInput,
  ArtistInput,
  TrackArtistInput,
  TrackInput,
} from "../services/types.js";

const getMetadata = async (path: string) => {
  const blob = await openAsBlob(path);
  if (!blob) {
    return null;
  }

  const metadata = await parseBlob(blob);
  return { blob, metadata };
};

export const generateId = (input: string) =>
  createHash("md5").update(input).digest("hex");

// https://sound.stackexchange.com/a/38725
const dbGainToLinear = (db: number) => 10 ** (db / 20);

const formatTime = (input: number) => {
  const secs = Math.round(input);
  const minutes = Math.floor(secs / 60) || 0;
  const seconds = Math.round(secs - minutes * 60) || 0;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const parseMediaFile = async (path: string) => {
  const result = await getMetadata(path);
  if (!result) {
    console.log(`unable to grab metadata for ${path}`);
    return null;
  }
  const {
    metadata: { common, format },
  } = result;

  const trackId = common.musicbrainz_trackid;
  if (!trackId) {
    return null;
  }

  const {
    album: albumName,
    musicbrainz_albumid: albumId,
    title,
    musicbrainz_artistid: artistIds,
    musicbrainz_albumartistid: albumArtistIds,
    artists: artistNames,
  } = common;

  if (
    !albumName ||
    !albumId ||
    !title ||
    !artistIds ||
    !albumArtistIds ||
    !artistNames
  ) {
    console.log(`missing required metadata on ${path}`);
    return null;
  }

  const trackGainDb = common.replaygain_track_gain?.dB || 0;
  const trackGainLinear = dbGainToLinear(trackGainDb);
  const trackPeakRatio = common.replaygain_track_peak?.ratio || 0;
  // const trackPeakDb = common.replaygain_track_peak?.dB || 0;
  // const trackPeakLinear = dbGainToLinear(trackPeakDb);
  const duration = Math.round(format.duration || 0);

  const track: TrackInput = {
    id: trackId,
    albumId,
    discNumber: common.disk.no,
    duration,
    formattedDuration: formatTime(duration),
    path: path.replaceAll(nodepath.sep, nodepath.posix.sep),
    title,
    trackGainLinear: String(trackGainLinear),
    trackNumber: common.track.no,
    trackPeak: String(trackPeakRatio),
  };

  if (artistNames.length !== artistIds.length) {
    console.log({ title: common.title, artists: artistNames, artistIds });
  }

  const artists: ArtistInput[] = artistIds.map((id, i) => ({
    id,
    name: artistNames[i] || "missing",
  }));

  if (albumArtistIds.includes("89ad4ac3-39f7-470e-963a-56509c546377")) {
    artists.push({
      name: "Various Artists",
      id: "89ad4ac3-39f7-470e-963a-56509c546377",
      image: "",
      imageThumb: "",
    });
  }

  const album: AlbumInput = {
    id: albumId,
    name: albumName,
  };

  const trackArtists: TrackArtistInput[] = artistIds.map((artistId, index) => ({
    trackId,
    artistId,
    index,
  }));

  const albumArtists: AlbumArtistInput[] = albumArtistIds.map(
    (artistId, index) => ({
      albumId,
      artistId,
      index,
    }),
  );

  return { track, artists, album, albumArtists, trackArtists };
};

export const getPictures = async (path: string) => {
  const result = await getMetadata(path);
  if (!result) {
    return null;
  }
  const {
    metadata: {
      common: { picture },
    },
  } = result;

  return picture;
};
