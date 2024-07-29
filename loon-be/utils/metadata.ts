import { createHash } from "node:crypto";
import { openAsBlob } from "node:fs";
import { parseBlob } from "music-metadata";

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
    return null;
  }
  const { blob, metadata } = result;
  const { common, format } = metadata;

  let recordingId = common.musicbrainz_recordingid;

  if (!recordingId) {
    console.log(`missing a recordingId on ${path}`);
    recordingId = createHash("md5")
      .update(`${common.artist}:${common.album}:${common.title}`)
      .digest("hex");
  }

  const trackGainDb = common.replaygain_track_gain?.dB || 0;
  const trackGainLinear = dbGainToLinear(trackGainDb);
  const trackPeakRatio = common.replaygain_track_peak?.ratio || 0;
  // const trackPeakDb = common.replaygain_track_peak?.dB || 0;
  // const trackPeakLinear = dbGainToLinear(trackPeakDb);

  const newtrack = {
    id: recordingId,
    album: common.album || "",
    albumArtist: common.albumartist || "",
    albumImageId: "todo",
    albumThumbnailId: "todo",
    artist: common.artist || "",
    artistImageId: "todo",
    artistThumbnailId: "todo",
    bitDepth: format.bitsPerSample,
    discNumber: common.disk.no,
    duration: Math.round(format.duration || 0),
    extension: "remove this field?",
    missingFile: false,
    musicBrainzTrackId: common.musicbrainz_trackid,
    path: path,
    sampleRate: format.sampleRate,
    size: blob.size,
    title: common.title || "",
    trackGain: String(trackGainDb),
    trackGainLinear: String(trackGainLinear),
    trackNumber: common.track.no,
    trackPeak: String(trackPeakRatio),
  };

  return newtrack;
};
