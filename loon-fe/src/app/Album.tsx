import MediaItem from "@/components/MediaItem";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import AlbumCard from "@/components/AlbumCard";
import { useLibraryStore } from "@/hooks/useLibraryStore";
import { sortBy } from "lodash-es";
import { useParams } from "react-router-dom";

export default function Album() {
  const { artist, album: albumName } = useParams();

  const album = useLibraryStore((state) => state.albums).find(
    (o) => o.artist === artist && o.name === albumName,
  );

  if (!album) return null;

  const albumTracks = sortBy(album.tracks, ["discNumber", "trackNumber"]);

  return (
    <section>
      <div className="max-w-96">
        <AlbumCard album={album} />
      </div>
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
