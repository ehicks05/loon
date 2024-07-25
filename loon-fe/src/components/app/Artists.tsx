import React from "react";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { sortBy, uniqBy } from "lodash";
import { type Track, useAppStore } from "../../common/AppContextProvider";
import { ArtistCard } from "../ArtistCard";

export interface Artist {
  name: string;
  imageId: string | null;
}

const trackToArtist = (track: Track): Artist => ({
  name: track.artist,
  imageId: track.artistThumbnailId,
});

export default function Artists() {
  const tracks = useAppStore((state) => state.tracks);
  const artists = sortBy(
    uniqBy(tracks.map(trackToArtist), (o: Artist) => o.name),
    ["name"],
  );

  return (
    <>
      <div className="p-2">{artists.length} Artists:</div>
      <div className="flex p-2">
        <div className="flex flex-wrap gap-2 justify-between">
          {artists.map((artist: Artist) => (
            <div key={artist.name} className="w-36">
              <ArtistCard artist={artist} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
