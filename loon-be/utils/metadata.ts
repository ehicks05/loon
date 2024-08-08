import { createHash } from "node:crypto";
import { openAsBlob } from "node:fs";
import { parseBlob } from "music-metadata";
import type { TrackInput } from "../services/types";

export const getMetadata = async (path: string) => {
  const blob = await openAsBlob(path);
  if (!blob) {
    return null;
  }

  const metadata = await parseBlob(blob);
  return { blob, metadata };
};

// https://sound.stackexchange.com/a/38725
const dbGainToLinear = (db: number) => 10 ** (db / 20);

export const getTrackInput = async (path: string) => {
  const result = await getMetadata(path);
  if (!result) {
    console.log(`unable to grab metadata for ${path}`);
    return null;
  }
  const {
    metadata: { common, format },
  } = result;

  const { artist, album, title } = common;
  if (!artist || !album || !title) {
    console.log(`missing basic metadata on ${path}`);
    return undefined;
  }

  let id = common.musicbrainz_trackid;
  if (!id) {
    console.log(`missing a recordingId on ${path}`);
    id = createHash("md5")
      .update(`${common.artist}:${common.album}:${common.title}`)
      .digest("hex");
  }

  const trackGainDb = common.replaygain_track_gain?.dB || 0;
  const trackGainLinear = dbGainToLinear(trackGainDb);
  const trackPeakRatio = common.replaygain_track_peak?.ratio || 0;
  // const trackPeakDb = common.replaygain_track_peak?.dB || 0;
  // const trackPeakLinear = dbGainToLinear(trackPeakDb);

  const newtrack: TrackInput = {
    id,
    album,
    albumArtist: common.albumartist || "",
    artist,
    discNumber: common.disk.no,
    duration: Math.round(format.duration || 0),
    musicBrainzTrackId: common.musicbrainz_trackid,
    path,
    title,
    trackGainLinear: String(trackGainLinear),
    trackNumber: common.track.no,
    trackPeak: String(trackPeakRatio),
  };

  return newtrack;
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
