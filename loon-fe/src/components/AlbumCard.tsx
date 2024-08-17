import { PLACEHOLDER_IMAGE_URL } from "@/constants";
import type { Album } from "@/types/trpc";
import { Link } from "react-router-dom";
import { getAlbumById } from "../hooks/useLibraryStore";
import ActionMenu from "./ActionMenu";

interface Props {
  album: Album;
  hideAlbumArtist?: boolean;
}

export default function AlbumCard({ album: _album, hideAlbumArtist }: Props) {
  const album = getAlbumById(_album.id);

  if (!album) return null;

  return (
    <div className="flex flex-col items-start">
      <div className="group relative">
        <img
          src={PLACEHOLDER_IMAGE_URL}
          data-src={album.image}
          alt="album"
          className="lazyload rounded-lg w-full aspect-square object-cover"
        />
        <div className="invisible group-hover:visible absolute top-2 right-2">
          <ActionMenu tracks={album.tracks} />
        </div>
      </div>
      <div className="p-3">
        {!hideAlbumArtist && (
          <span className="line-clamp-3">
            {" "}
            {album.artists.map(({ id, name }, i) => (
              <span key={id}>
                {i !== 0 && ", "}
                <Link to={`/artists/${id}`}>{name}</Link>
              </span>
            ))}
          </span>
        )}

        <Link to={`/albums/${album.id}`}>
          <span className="font-bold">{album.name}</span>
        </Link>
      </div>
    </div>
  );
}
