import React from "react";
import { Link } from "react-router-dom";
import { useAppStore, useDistinctArtists } from "../common/AppContextProvider";
import ActionMenu from "./ActionMenu";
import { PLACEHOLDER_IMAGE_URL, getImageUrl } from "./utils";

export default function AlbumCard({ album, hideAlbumArtist }) {
  const tracks = useAppStore((state) => state.tracks);
  const distinctArtists = useDistinctArtists();

  const imageUrl = getImageUrl(album.albumImageId);

  const contextMenuId = `artist=${album.albumArtist},album=${album.album}`;

  const albumTracks = tracks.filter(
    (track) =>
      track.albumArtist === album.albumArtist && track.album === album.album,
  );

  const linkAlbumArtist = distinctArtists.includes(album.albumArtist);

  let albumArtistText = (
    <span title={album.albumArtist}>{album.albumArtist}</span>
  );
  if (linkAlbumArtist)
    albumArtistText = (
      <Link to={`/artist/${album.albumArtist}`}>{albumArtistText}</Link>
    );

  const albumArtist = hideAlbumArtist ? null : (
    <span className="line-clamp-3">{albumArtistText}</span>
  );

  return (
    <div>
      <div className="group relative">
        <img
          src={PLACEHOLDER_IMAGE_URL}
          data-src={imageUrl}
          alt="Placeholder"
          className="lazyload rounded w-36 h-36 object-cover"
        />
        <div className="invisible group-hover:visible absolute top-2 right-2">
          <ActionMenu tracks={albumTracks} contextMenuId={contextMenuId} />
        </div>
      </div>
      <div className="p-3">
        {albumArtist}

        <Link to={`/artist/${album.albumArtist}/album/${album.album}`}>
          <span
            className="font-bold"
            title={`${album.albumArtist} - ${album.album}`}
          >
            {album.album}
          </span>
        </Link>
      </div>
    </div>
  );
}
