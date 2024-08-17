import MediaItem from "@/components/MediaItem";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import AlbumCard from "@/components/AlbumCard";
import { getAlbumById } from "@/hooks/useLibraryStore";
import { useParams } from "react-router-dom";

export default function Album() {
  const { id } = useParams();

  const album = getAlbumById(id || "");
  if (!album) return null;

  return (
    <section>
      <div className="max-w-96">
        <AlbumCard album={album} />
      </div>
      <ul className="flex flex-col">
        {album.tracks.map((track) => (
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
