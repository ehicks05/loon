import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  setSelectedPlaylistId,
  useUserStore,
} from "../common/UserContextProvider";
import ActionMenu from "./ActionMenu";

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
    (state) => state.userState.selectedTrackId,
  );
  const selectedContextMenuId = useUserStore(
    (state) => state.selectedContextMenuId,
  );

  function handleHoverTrue() {
    setHover(true);
  }

  function handleHoverFalse() {
    setHover(false);
  }

  function handleSelectedTrackIdChange(e, selectedPlaylistId, selectedTrackId) {
    console.log(
      `setSelectedPlaylistId:${selectedPlaylistId}...${selectedTrackId}`,
    );
    setSelectedPlaylistId(selectedPlaylistId, selectedTrackId);
  }

  const artist = track.artist ? track.artist : "Missing!";
  const trackTitle = track.title ? track.title : "Missing!";
  const album = track.album ? track.album : "Missing!";

  const formattedDuration = track.formattedDuration;

  const highlightClass =
    track.id === selectedTrackId ? " playingHighlight" : "";

  const innerRef = provided ? provided.innerRef : null;
  const draggableStyle = provided ? provided.draggableProps.style : null;
  const draggableProps = provided ? provided.draggableProps : null;
  const dragHandleProps = provided ? provided.dragHandleProps : null;

  const contextMenuId = `trackId=${track.id}`;
  const isDropdownActive = selectedContextMenuId === contextMenuId;
  const isDragging = snapshot ? snapshot.isDragging : false;

  const showActionMenu = !isDragging && (hover || isDropdownActive);

  const missingFile = track.missingFile;

  const handleChangeTrack = missingFile
    ? () => {}
    : (e) => handleSelectedTrackIdChange(e, playlistId, track.id);

  return (
    <div
      className={`group flex h-full p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all ${highlightClass} ${missingFile ? "bg-red-400" : ""}`}
      id={`track${track.id}`}
      ref={innerRef}
      {...draggableProps}
      style={getRowStyle(draggableStyle, isDragging)}
      onMouseEnter={handleHoverTrue}
      onMouseLeave={handleHoverFalse}
    >
      <div className={"mr-1 min-w-8 text-right"}>{trackNumber}</div>

      <div {...dragHandleProps} className={"flex-grow"}>
        <button
          type="button"
          disabled={missingFile}
          className="line-clamp-1 font-bold"
          onClick={handleChangeTrack}
          onKeyUp={handleChangeTrack}
        >
          {trackTitle}
        </button>
        {missingFile && (
          <span className={"tag is-normal is-danger ml-4"}>Track Missing</span>
        )}
        <span className="line-clamp-1 text-sm">
          <Link
            className="text-neutral-600 hover:text-neutral-300 dark:text-neutral-400 hover:dark:text-neutral-300"
            to={`/artist/${artist}`}
          >
            {artist}
          </Link>
          {" - "}
          <Link
            className="text-neutral-600 hover:text-neutral-300 dark:text-neutral-400 hover:dark:text-neutral-300"
            to={`/artist/${track.albumArtist}/album/${album}`}
          >
            <i>{album}</i>
          </Link>
        </span>
      </div>

      <div className={"mr-2 flex basis-5 items-center"}>
        {showActionMenu && (
          <ActionMenu tracks={[track]} contextMenuId={contextMenuId} />
        )}
      </div>

      <div className="basis-5">{formattedDuration}</div>
    </div>
  );
}
