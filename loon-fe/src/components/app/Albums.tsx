import React from "react";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { isEqual, sortBy, uniqWith } from "lodash";
import { type Track, useAppStore } from "../../common/AppContextProvider";
import AlbumCard from "../AlbumCard";

interface Props {
  tracks?: Track[];
  hideAlbumArtist?: boolean;
}

export default function Albums({ tracks: _tracks, hideAlbumArtist }: Props) {
  const tracks = _tracks || useAppStore((state) => state.tracks);

  const albums = sortBy(
    uniqWith(
      tracks.map((track) => ({
        name: track.album,
        artist: track.albumArtist,
        imageId: track.albumThumbnailId,
      })),
      isEqual,
    ),
    ["artist", "name"],
  );

  return (
    <div className="flex p-2">
      <div className="flex flex-wrap gap-2 justify-between">
        {albums.map((album) => (
          <div key={`${album.artist}-${album.name}`} className="w-36">
            <AlbumCard album={album} hideAlbumArtist={hideAlbumArtist} />
          </div>
        ))}
      </div>
    </div>
  );
}
