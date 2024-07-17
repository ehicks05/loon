import React from "react";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { useAppStore } from "../../common/AppContextProvider";
import { useWindowSize } from "react-use";
import AlbumCard from "../AlbumCard";
import _ from "lodash";

export default function Albums(props) {
  let tracks = useAppStore((state) => state.tracks);
  const windowSize = useWindowSize();

  if (props.tracks) tracks = props.tracks;

  const hideTitle = props.hideTitle;
  const hideAlbumArtist = props.hideAlbumArtist;

  const albums = _.chain(tracks)
    .map((track) => ({
      albumArtist: track.albumArtist,
      album: track.album,
      albumImageId: track.albumThumbnailId,
    }))
    .uniqWith(_.isEqual)
    .sortBy(["albumArtist", "album"])
    .value();

  const albumItems = albums.map((album) => {
    return (
      <AlbumCard
        key={album.albumArtist + "-" + album.album}
        album={album}
        hideAlbumArtist={hideAlbumArtist}
      />
    );
  });

  const windowWidth = windowSize.width;
  const gridItemWidth =
    windowWidth <= 768
      ? 150
      : windowWidth < 1024
      ? 175
      : windowWidth < 1216
      ? 200
      : windowWidth < 1408
      ? 225
      : 250;

  return (
    <div>
      {!hideTitle && (
        <div className="title" style={{ padding: ".5rem" }}>
          {albums.length} Albums:
        </div>
      )}
      <div
        id="playlist"
        className="playlist"
        style={{ display: "flex", flexDirection: "column" }}
      >
        <div style={{ padding: ".5rem", flex: "1", flexGrow: "1" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(" + gridItemWidth + "px, 1fr))",
              gridGap: ".5em",
            }}
          >
            {albumItems}
          </div>
        </div>
      </div>
    </div>
  );
}
