import React from "react";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import _ from "lodash";
import { useAppStore } from "../../common/AppContextProvider";
import AlbumCard from "../AlbumCard";

export default function Albums({
  tracks: _tracks,
  hideTitle,
  hideAlbumArtist,
}) {
  const tracks = _tracks ? _tracks : useAppStore((state) => state.tracks);

  const albums = _.chain(tracks)
    .map((track) => ({
      albumArtist: track.albumArtist,
      album: track.album,
      albumImageId: track.albumThumbnailId,
    }))
    .uniqWith(_.isEqual)
    .sortBy(["albumArtist", "album"])
    .value();

  return (
    <>
      {!hideTitle && <div className="p-2">{albums.length} Albums:</div>}
      <div className="flex p-2">
        <div className="flex flex-wrap gap-2 justify-between">
          {albums.map((album) => (
            <div key={`${album.albumArtist}-${album.album}`} className="w-36">
              <AlbumCard album={album} hideAlbumArtist={hideAlbumArtist} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
