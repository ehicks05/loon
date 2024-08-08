import MediaItem from "@/components/MediaItem";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { useAppStore } from "@/common/AppContextProvider";
import AlbumCard from "@/components/AlbumCard";
import { sortBy } from "lodash";
import { useRouteMatch } from "react-router-dom";

export default function Album() {
  const {
    params: { album, artist },
  } = useRouteMatch<{ artist: string; album: string }>();

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
