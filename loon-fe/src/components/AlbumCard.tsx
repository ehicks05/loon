import { PLACEHOLDER_IMAGE_URL } from "@/constants";
import { Link } from "react-router-dom";
import { useAppStore, useDistinctArtists } from "../common/AppContextProvider";
import ActionMenu from "./ActionMenu";

interface Album {
  name: string;
  artist: string;
  imageId: string | null;
}

interface Props {
  album: Album;
  hideAlbumArtist?: boolean;
}

export default function AlbumCard({ album, hideAlbumArtist }: Props) {
  const tracks = useAppStore((state) => state.tracks);
  const distinctArtists = useDistinctArtists();

  const albumTracks = tracks.filter(
    (track) => track.albumArtist === album.artist && track.album === album.name,
  );

  const linkAlbumArtist = distinctArtists.includes(album.artist);

  let albumArtistText = <span title={album.artist}>{album.artist}</span>;
  if (linkAlbumArtist)
    albumArtistText = (
      <Link to={`/artists/${album.artist}`}>{albumArtistText}</Link>
    );

  return (
    <div className="flex flex-col items-start">
      <div className="group relative">
        <img
          src={PLACEHOLDER_IMAGE_URL}
          data-src={album.imageId}
          alt="Placeholder"
          className="lazyload rounded w-36 h-36 object-cover"
        />
        <div className="invisible group-hover:visible absolute top-2 right-2">
          <ActionMenu tracks={albumTracks} />
        </div>
      </div>
      <div className="p-3">
        {!hideAlbumArtist && (
          <span className="line-clamp-3">{albumArtistText}</span>
        )}

        <Link to={`/artists/${album.artist}/albums/${album.name}`}>
          <span className="font-bold" title={`${album.artist} - ${album.name}`}>
            {album.name}
          </span>
        </Link>
      </div>
    </div>
  );
}
