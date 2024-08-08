import { useAppStore } from "@/common/AppContextProvider";
import { ArtistCard } from "@/components/ArtistCard";
import MediaItem from "@/components/MediaItem";
import { sortBy } from "lodash";
import { useRouteMatch } from "react-router-dom";
import Albums from "./Albums";

export default function Artist() {
  const {
    params: { artist },
  } = useRouteMatch<{ artist: string }>();
  const tracks = useAppStore((state) => state.tracks);

  const artistTracks = sortBy(
    tracks.filter((track) => track.artist === artist),
    ["album", "discNumber", "trackNumber"],
  );

  return (
    <section className="">
      <div className="flex flex-col gap-4">
        <ArtistCard
          artist={{
            name: artistTracks[0]?.artist,
            imageId: artistTracks[0]?.spotifyArtistImage,
          }}
        />
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
