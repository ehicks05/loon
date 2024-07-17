import React from "react";
import { useUserStore } from "../common/UserContextProvider";
import { useWindowSize } from "react-use";

function formatTime(secs) {
  const minutes = Math.floor(secs / 60) || 0;
  const seconds = secs - minutes * 60 || 0;
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

export default function DraggingMediaItem({ trackNumber, track, provided }) {
  const selectedTrackId = useUserStore(
    (state) => state.userState.selectedTrackId
  );
  const windowSize = useWindowSize();

  function limitLength(input, fraction) {
    const limit = (windowSize.width * 1.6) / 20 / fraction;
    if (input.length > limit) return input.substring(0, limit) + "...";
    return input;
  }

  const artist = track.artist ? limitLength(track.artist, 1.8) : "Missing!";
  const trackTitle = track.title ? limitLength(track.title, 1) : "Missing!";
  const album = track.album ? limitLength(track.album, 1.8) : "Missing!";
  const formattedDuration = track.duration;

  const highlightClass =
    track.id === selectedTrackId ? " playingHighlight" : "";

  const innerRef = provided ? provided.innerRef : null;
  const draggableProps = provided ? provided.draggableProps : null;
  const dragHandleProps = provided ? provided.dragHandleProps : null;

  const missingFile = track.missingFile;
  const trackTitleEl = (
    <b style={{ cursor: missingFile ? "default" : "pointer" }}>{trackTitle}</b>
  );

  return (
    <div
      className={highlightClass}
      id={"track" + track.id}
      ref={innerRef}
      {...draggableProps}
      style={{
        userSelect: "none",
        filter: "brightness(130%)",
        boxSizing: "border-box",
        border: "3px solid gray",
      }}
    >
      <div
        className={"mediaItemDiv"}
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
            {artist} - <i>{album}</i>
          </span>
        </div>

        <div className={"mediaItemEllipsis"}></div>

        <div style={{ flexBasis: "20px" }}>{formatTime(formattedDuration)}</div>
      </div>
    </div>
  );
}
