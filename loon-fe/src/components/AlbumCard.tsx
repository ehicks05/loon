import type { Album } from "@/types/trpc";
import { Link } from "react-router-dom";
import { getAlbumById } from "../hooks/useLibraryStore";
import { ActionableImage } from "./ActionableImage";
import { ArtistLinks } from "./ArtistLinks";

const CUSTOM_SIZES = [
  { length: 8, size: "text-xl" },
  { length: 16, size: "text-lg" },
  { length: 24, size: "text-base" },
  { length: 32, size: "text-sm" },
] as const;

interface Props {
  album: Album;
  hideAlbumArtist?: boolean;
}

export default function AlbumCard({ album: _album, hideAlbumArtist }: Props) {
  const album = getAlbumById(_album.id);
  if (!album) return null;

  const albumNameSize =
    CUSTOM_SIZES.find((customSize) => album.name.length <= customSize.length)
      ?.size || "text-xs";

  return (
    <div className="flex flex-col items-start">
      <ActionableImage src={album.image} tracks={album.tracks} />
      <div className="flex flex-col p-3 text-center w-full">
        {!hideAlbumArtist && (
          <span className="text-sm">
            <ArtistLinks artists={album.artists} />
          </span>
        )}

        <Link to={`/albums/${album.id}`}>
          <span className={albumNameSize}>{album.name}</span>
        </Link>
      </div>
    </div>
  );
}
