import { useAppStore } from "@/common/AppContextProvider";
import { ArtistCard } from "@/components/ArtistCard";
import MediaItem from "@/components/MediaItem";
import { sortBy } from "lodash-es";
import { useSearchParams } from "react-router-dom";
import Albums from "./Albums";
import { trackToArtist } from "./Artists";

export default function Artist() {
  const [searchParams] = useSearchParams();
  const artist = searchParams.get("artist");
  const tracks = useAppStore((state) => state.tracks);

  const artistTracks = sortBy(
    tracks.filter((track) => track.artist === artist),
    ["album", "discNumber", "trackNumber"],
  );

  if (artistTracks.length === 0) return null;

  return (
    <section className="">
      <div className="flex flex-col gap-4">
        <ArtistCard artist={trackToArtist(artistTracks[0])} size="full" />
        <div className="">
          <div className="text-lg font-bold">Albums</div>
          <Albums tracks={artistTracks} hideAlbumArtist={true} />

          <div className="text-lg font-bold">Tracks</div>
          <ul className="flex flex-col">
            {artistTracks.map((track, i) => (
              <MediaItem
                key={track.id}
                playlistId={""}
                track={track}
                trackNumber={i + 1}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
