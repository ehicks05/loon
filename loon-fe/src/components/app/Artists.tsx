import React from "react";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import _ from "lodash";
import { type Track, useAppStore } from "../../common/AppContextProvider";
import { ArtistCard } from "../ArtistCard";

export interface Artist {
  name: string;
  imageId: string;
}

const trackToArtist = (track: Track): Artist => ({
  name: track.artist,
  imageId: track.artistThumbnailId,
});

export default function Artists() {
  const tracks = useAppStore((state) => state.tracks);

  const artists = _.uniqBy(tracks.map(trackToArtist), (o: Artist) => o.name);

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
