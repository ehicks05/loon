import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { useAppStore } from "@/common/AppContextProvider";
import type { Track } from "@/common/types";
import { ArtistCard } from "@/components/ArtistCard";
import { sortBy, uniqBy } from "lodash";

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
