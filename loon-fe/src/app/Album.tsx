import MediaItem from "@/components/MediaItem";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { useAppStore } from "@/common/AppContextProvider";
import AlbumCard from "@/components/AlbumCard";
import { sortBy } from "lodash-es";
import { useSearchParams } from "react-router-dom";

export default function Album() {
  const [searchParams] = useSearchParams();
  const artist = searchParams.get("artist");
  const album = searchParams.get("album");

  const tracks = useAppStore((state) => state.tracks);
  const albumTracks = sortBy(
    tracks.filter(
      (track) => track.albumArtist === artist && track.album === album,
    ),
    ["discNumber", "trackNumber"],
  );

  return (
    <section>
      <AlbumCard
        album={{
          artist: albumTracks[0]?.albumArtist,
          name: albumTracks[0]?.album,
          imageId: albumTracks[0]?.spotifyAlbumImageThumb,
        }}
      />
      <ul className="flex flex-col">
        {albumTracks.map((track) => (
          <MediaItem
            key={track.id}
            playlistId={""}
            track={track}
            trackNumber={`${track.discNumber}.${track.trackNumber}`}
          />
        ))}
      </ul>
    </section>
  );
}
