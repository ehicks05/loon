import { Link } from "react-router-dom";
import React from "react";
import { getTrackById } from "../../../common/AppContextProvider";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { useUserStore } from "../../../common/UserContextProvider";
import { PLACEHOLDER_IMAGE_URL, getImageUrl } from "components/utils";
import { useWindowSize } from "react-use";

export default function TrackDescription() {
  const selectedTrackId = useUserStore(
    (state) => state.userState.selectedTrackId
  );
  const { width } = useWindowSize();

  const selectedTrack = getTrackById(selectedTrackId);

  const artist = selectedTrack ? selectedTrack.artist : "";
  const albumArtist = selectedTrack ? selectedTrack.albumArtist : "";
  const album = selectedTrack ? selectedTrack.album : "";
  const title = selectedTrack ? selectedTrack.title : "";

  const textWidth = width >= 768 ? "calc(100vw - 408px)" : "100%";

  const imageUrl = getImageUrl(selectedTrack?.albumThumbnailId);

  // todo: does this need to be lazyload?
  const albumArt = (
    <img
      src={PLACEHOLDER_IMAGE_URL}
      data-src={imageUrl}
      alt="Placeholder"
      className="lazyload"
      style={{ height: "48px", margin: "0", paddingRight: "8px" }}
    />
  );

  return (
    <div className="level-item">
      {albumArt}
      <span
        id="track"
        style={{ maxWidth: textWidth, maxHeight: "48px", overflow: "auto" }}
      >
        <b>{title}</b>
        <br />
        <span id="artistAlbumText" style={{ fontSize: ".875rem" }}>
          <Link to={"/artist/" + artist}>{artist}</Link>
          {" - "}
          <Link to={"/artist/" + albumArtist + "/album/" + album}>
            <i>{album}</i>
          </Link>
        </span>
      </span>
    </div>
  );
}
