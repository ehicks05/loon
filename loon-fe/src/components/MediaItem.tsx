import type {
  DraggableProvided,
  DraggableStateSnapshot,
  DraggableStyle,
} from "@hello-pangea/dnd";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  setSelectedPlaylistId,
  useUserStore,
} from "../common/UserContextProvider";
import type { Track } from "../common/types";
import ActionMenu from "./ActionMenu";

const getRowStyle = (
  isDragging: boolean,
  draggableStyle?: DraggableStyle | null,
) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  filter: isDragging ? "brightness(150%)" : "",
  // styles we need to apply on draggables
  ...draggableStyle,
});

interface Props {
  trackNumber: number;
  track: Track;
  playlistId: string;
  provided?: DraggableProvided;
  snapshot?: DraggableStateSnapshot;
}

export default function MediaItem({
  trackNumber,
  track,
  playlistId,
  provided,
  snapshot,
}: Props) {
  const [hover, setHover] = useState(false);
  const { selectedTrackId, selectedContextMenuId } = useUserStore((state) => ({
    selectedTrackId: state.userState.selectedTrackId,
    selectedContextMenuId: state.userState.selectedContextMenuId,
  }));

  const artist = track.artist ? track.artist : "Missing!";
  const trackTitle = track.title ? track.title : "Missing!";
  const album = track.album ? track.album : "Missing!";
  const missingFile = track.missingFile;
  const highlightClass = track.id === selectedTrackId ? "text-green-500" : "";

  const contextMenuId = `trackId=${track.id}`;
  const isDropdownActive = selectedContextMenuId === contextMenuId;
  const isDragging = snapshot?.isDragging || false;

  const showActionMenu = !isDragging && (hover || isDropdownActive);

  return (
    <div
      className={`group flex h-full p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all ${highlightClass} ${missingFile ? "bg-red-400" : ""}`}
      id={`track${track.id}`}
      ref={provided?.innerRef}
      style={getRowStyle(isDragging, provided?.draggableProps.style)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...provided?.draggableProps}
    >
      <div className={"mr-1 min-w-8 text-right"}>{trackNumber}</div>

      <div {...provided?.dragHandleProps} className={"flex-grow"}>
        <button
          type="button"
          disabled={missingFile || undefined}
          className="line-clamp-1 font-bold"
          onClick={() => setSelectedPlaylistId(playlistId, track.id)}
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

      <div
        className={
          "mr-2 flex basis-5 items-center dark:text-neutral-400 hover:dark:text-neutral-300"
        }
      >
        {showActionMenu && (
          <ActionMenu tracks={[track]} contextMenuId={contextMenuId} />
        )}
      </div>

      <div className="basis-5">{track.formattedDuration}</div>
    </div>
  );
}
