import React, { useState } from "react";
import { Link } from "react-router-dom";
import ActionMenu from "./ActionMenu";
import { useAppStore, useDistinctArtists } from "../common/AppContextProvider";
import { useUserStore } from "../common/UserContextProvider";
import { PLACEHOLDER_IMAGE_URL, getImageUrl } from "./utils";

export default function AlbumCard(props) {
  const [hover, setHover] = useState(false);
  const tracks = useAppStore((state) => state.tracks);
  const distinctArtists = useDistinctArtists();
  const selectedContextMenuId = useUserStore(
    (state) => state.selectedContextMenuId
  );

  function handleHoverTrue() {
    setHover(true);
  }

  function handleHoverFalse() {
    setHover(false);
  }

  const album = props.album;
  const displayArtist =
    album.albumArtist.length > 15
      ? album.albumArtist.substring(0, 32)
      : album.albumArtist;
  const displayAlbum =
    album.album.length > 15 ? album.album.substring(0, 32) : album.album;
  const imageUrl = getImageUrl(album.albumImageId);

  const contextMenuId = "artist=" + album.albumArtist + ",album=" + album.album;
  const isContextMenuSelected = selectedContextMenuId === contextMenuId;

  const showActionMenu = hover || isContextMenuSelected;
  const actionMenuTracks = showActionMenu
    ? tracks.filter(
        (track) =>
          track.albumArtist === album.albumArtist && track.album === album.album
      )
    : [];

  const hideAlbumArtist = props.hideAlbumArtist;

  const linkAlbumArtist = distinctArtists.includes(album.albumArtist);

  let albumArtistText = <span title={album.albumArtist}>{displayArtist}</span>;
  if (linkAlbumArtist)
    albumArtistText = (
      <Link to={"/artist/" + album.albumArtist}>{albumArtistText}</Link>
    );

  const albumArtist = hideAlbumArtist ? null : (
    <span>
      {albumArtistText}
      &nbsp;-&nbsp;
    </span>
  );

  return (
    <div
      className="card"
      onMouseEnter={handleHoverTrue}
      onMouseLeave={handleHoverFalse}
    >
      <div className="card-image">
        <figure className={"image is-square"}>
          <img
            src={PLACEHOLDER_IMAGE_URL}
            data-src={imageUrl}
            alt="Placeholder"
            className="lazyload"
          />
          {showActionMenu && (
            <ActionMenu
              tracks={actionMenuTracks}
              contextMenuId={contextMenuId}
              style={{ position: "absolute", top: "8px", right: "8px" }}
            />
          )}
        </figure>
      </div>
      <div className="card-content" style={{ padding: ".75rem" }}>
        <div className="content">
          {albumArtist}

          <Link to={"/artist/" + album.albumArtist + "/album/" + album.album}>
            <span title={album.albumArtist + " - " + album.album}>
              {displayAlbum}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
