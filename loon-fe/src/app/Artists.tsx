import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { useAppStore } from "@/common/AppContextProvider";
import type { Track } from "@/common/types";
import { ArtistCard } from "@/components/ArtistCard";
import { sortBy, uniqBy } from "lodash-es";

export interface Artist {
  name: string;
  image: string | null;
  imageThumb: string | null;
}

export const trackToArtist = (track: Track): Artist => ({
  name: track.artist,
  image: track.spotifyArtistImage,
  imageThumb: track.spotifyArtistImageThumb,
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {artists.map((artist: Artist) => (
            <div key={artist.name} className="w-full">
              <ArtistCard artist={artist} size="thumb" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
