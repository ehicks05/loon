import React from "react";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import _ from "lodash";
import { useAppStore } from "../../common/AppContextProvider";
import { ArtistCard } from "../ArtistCard";

export default function Artists() {
  const tracks = useAppStore((state) => state.tracks);

  const artists = _.uniqBy(
    tracks.map((track) => ({
      artistName: track.artist,
      artistImageId: track.artistThumbnailId,
    })),
    (o) => o.artistName,
  );

  return (
    <>
      <div className="p-2">{artists.length} Artists:</div>
      <div className="flex p-2">
        <div className="flex flex-wrap gap-2 justify-between">
          {artists.map((artist) => (
            <div key={artist.artistName} className="w-36">
              <ArtistCard artist={artist} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
