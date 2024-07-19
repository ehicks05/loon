import React from "react";
import { Link } from "react-router-dom";
import { getTrackById } from "../../../common/AppContextProvider";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { PLACEHOLDER_IMAGE_URL, getImageUrl } from "@/components/utils";
import { useWindowSize } from "usehooks-ts";
import { useUserStore } from "../../../common/UserContextProvider";

export default function TrackDescription() {
  const selectedTrackId = useUserStore(
    (state) => state.userState.selectedTrackId,
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
      className="lazyload h-12 m-0"
    />
  );

  return (
    <div className="flex gap-2">
      {albumArt}
      <span
        id="track"
        className="flex flex-col max-h-12 overflow-auto"
        style={{ maxWidth: textWidth }}
      >
        <b>{title}</b>
        <span id="artistAlbumText" className="text-sm">
          <Link to={`/artist/${artist}`}>{artist}</Link>
          {" - "}
          <Link to={`/artist/${albumArtist}/album/${album}`}>
            <i>{album}</i>
          </Link>
        </span>
      </span>
    </div>
  );
}
