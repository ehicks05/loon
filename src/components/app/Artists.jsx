import React from "react";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { ArtistCard } from "../ArtistCard";
import { useAppStore } from "../../common/AppContextProvider";
import { useWindowSize } from "react-use";
import _ from "lodash";

export default function Artists() {
  const tracks = useAppStore((state) => state.tracks);
  const windowSize = useWindowSize();

  const artists = _.chain(tracks)
    .map((track) => ({
      artistName: track.artist,
      artistImageId: track.artistThumbnailId,
    }))
    .uniqWith(_.isEqual)
    .value();

  const artistItems = artists.map((artist) => {
    return <ArtistCard key={artist.artistName} artist={artist} />;
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
      <div className="title" style={{ padding: ".5rem" }}>
        {artists.length} Artists:
      </div>
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
            {artistItems}
          </div>
        </div>
      </div>
    </div>
  );
}
