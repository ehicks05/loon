import React, { useState } from "react";
import ActionMenu from "./ActionMenu";
import { Link } from "react-router-dom";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { useAppStore } from "../common/AppContextProvider";
import { useUserStore } from "../common/UserContextProvider";
import { PLACEHOLDER_IMAGE_URL, getImageUrl } from "./utils";

export function ArtistCard(props) {
  const [hover, setHover] = useState(false);
  const tracks = useAppStore((state) => state.tracks);
  const selectedContextMenuId = useUserStore(
    (state) => state.selectedContextMenuId
  );
  function handleHoverTrue() {
    setHover(true);
  }

  function handleHoverFalse() {
    setHover(false);
  }

  const artist = props.artist;
  const imageUrl = getImageUrl(artist.artistImageId);

  const contextMenuId = "artist=" + artist.artistName;
  const isContextMenuSelected = selectedContextMenuId === contextMenuId;

  const showActionMenu = hover || isContextMenuSelected;
  const actionMenuTracks = showActionMenu
    ? tracks.filter((track) => track.artist === artist.artistName)
    : [];

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
          <Link to={"/artist/" + artist.artistName}>{artist.artistName}</Link>
        </div>
      </div>
    </div>
  );
}
