import type { Album } from "@/types/trpc";
import { Link } from "react-router-dom";
import { getAlbumById } from "../hooks/useLibraryStore";
import { ActionableImage } from "./ActionableImage";
import { ArtistLinks } from "./ArtistLinks";

interface Props {
  album: Album;
  hideAlbumArtist?: boolean;
}

export default function AlbumCard({ album: _album, hideAlbumArtist }: Props) {
  const album = getAlbumById(_album.id);

  if (!album) return null;

  return (
    <div className="flex flex-col items-start">
      <ActionableImage src={album.image} tracks={album.tracks} />
      <div className="p-3">
        {!hideAlbumArtist && <ArtistLinks artists={album.artists} />}

        <Link to={`/albums/${album.id}`}>
          <span className="font-bold">{album.name}</span>
        </Link>
      </div>
    </div>
  );
}
