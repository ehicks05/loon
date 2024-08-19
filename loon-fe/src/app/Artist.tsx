import { ActionableImage } from "@/components/ActionableImage";
import AlbumCard from "@/components/AlbumCard";
import { ArtistCard } from "@/components/ArtistCard";
import MediaItem from "@/components/MediaItem";
import { getArtistById } from "@/hooks/useLibraryStore";
import { useParams } from "react-router-dom";

export default function Artist() {
  const { id } = useParams();
  const artist = getArtistById(id);

  if (!artist) return null;

  return (
    <section className="">
      <div className="flex flex-col gap-4">
        <div className="max-w-96">
          <ArtistCard artist={artist} size="full" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-lg font-bold">Albums</div>

          <div className="flex flex-col gap-8">
            {artist.albums.map((album) => (
              <div key={album.name} className="flex flex-col gap-4">
                <div className="max-w-40 flex items-center gap-4">
                  <ActionableImage
                    src={album.imageThumb}
                    tracks={album.tracks}
                  />
                  <div className="text-xl flex-shrink-0">{album.name}</div>
                </div>

                <div>
                  {album.tracks.map((track, i) => (
                    <MediaItem
                      key={track.id}
                      playlistId={""}
                      track={track}
                      trackNumber={i + 1}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
