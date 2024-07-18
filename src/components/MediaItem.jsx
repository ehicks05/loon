import React, { useState } from "react";
import ActionMenu from "./ActionMenu";
import { Link } from "react-router-dom";
import {
  useUserStore,
  setSelectedPlaylistId,
} from "../common/UserContextProvider";
import { useWindowSize } from "react-use";

const getRowStyle = (draggableStyle, isDragging) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  filter: isDragging ? "brightness(150%)" : "",
  // styles we need to apply on draggables
  ...draggableStyle,
});

export default function MediaItem({
  trackNumber,
  track,
  playlistId,
  provided,
  snapshot,
}) {
  const [hover, setHover] = useState(false);
  const selectedTrackId = useUserStore(
    (state) => state.userState.selectedTrackId
  );
  const selectedContextMenuId = useUserStore(
    (state) => state.selectedContextMenuId
  );

  const windowSize = useWindowSize();

  function handleHoverTrue() {
    setHover(true);
  }

  function handleHoverFalse() {
    setHover(false);
  }

  function handleSelectedTrackIdChange(e, selectedPlaylistId, selectedTrackId) {
    console.log(
      `setSelectedPlaylistId:${selectedPlaylistId}...${selectedTrackId}`
    );
    setSelectedPlaylistId(selectedPlaylistId, selectedTrackId);
  }

  // not sure this is a good idea...
  function limitLength(input, fraction) {
    const limit = (windowSize.width * 1.6) / 20 / fraction;
    if (input.length > limit) return input.substring(0, limit) + "...";
    return input;
  }

  const artist = track.artist ? track.artist : "Missing!";
  const trackTitle = track.title ? track.title : "Missing!";
  const album = track.album ? track.album : "Missing!";

  const trimmedArtist = limitLength(artist, 1.8);
  const trimmedTrackTitle = limitLength(trackTitle, 1);
  const trimmedAlbum = limitLength(album, 1.8);

  const formattedDuration = track.formattedDuration;

  const highlightClass =
    track.id === selectedTrackId ? " playingHighlight" : "";

  const innerRef = provided ? provided.innerRef : null;
  const draggableStyle = provided ? provided.draggableProps.style : null;
  const draggableProps = provided ? provided.draggableProps : null;
  const dragHandleProps = provided ? provided.dragHandleProps : null;

  const contextMenuId = "trackId=" + track.id;
  const isDropdownActive = selectedContextMenuId === contextMenuId;
  const isDragging = snapshot ? snapshot.isDragging : false;

  const showActionMenu = !isDragging && (hover || isDropdownActive);

  const missingFile = track.missingFile;
  const trackTitleEl = (
    <b
      style={{ cursor: missingFile ? "default" : "pointer" }}
      onClick={
        missingFile
          ? null
          : (e) => handleSelectedTrackIdChange(e, playlistId, track.id)
      }
    >
      {trimmedTrackTitle}
    </b>
  );

  return (
    <div
      className={highlightClass}
      id={"track" + track.id}
      ref={innerRef}
      {...draggableProps}
      style={getRowStyle(draggableStyle, isDragging)}
    >
      <div
        className={"mediaItemDiv"}
        onMouseEnter={handleHoverTrue}
        onMouseLeave={handleHoverFalse}
        style={missingFile ? { color: "red" } : null}
      >
        <div className={"mediaItemCounter"}>{trackNumber}</div>

        <div {...dragHandleProps} className={"list-song"}>
          {trackTitleEl}
          {missingFile && (
            <span
              style={{ marginLeft: "1em" }}
              className={"tag is-normal is-danger"}
            >
              Track Missing
            </span>
          )}
          <br />
          <span style={{ fontSize: ".875rem" }}>
            <Link to={"/artist/" + artist}>{trimmedArtist}</Link> -{" "}
            <Link to={"/artist/" + track.albumArtist + "/album/" + album}>
              <i>{trimmedAlbum}</i>
            </Link>
          </span>
        </div>

        <div className={"mediaItemEllipsis"}>
          {showActionMenu && (
            <ActionMenu tracks={[track]} contextMenuId={contextMenuId} />
          )}
        </div>

        <div style={{ flexBasis: "20px" }}>{formattedDuration}</div>
      </div>
    </div>
  );
}
