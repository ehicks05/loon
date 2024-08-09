import type {
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { Link } from "react-router-dom";
import {
  setSelectedPlaylistId,
  useUserStore,
} from "../common/UserContextProvider";
import type { Track } from "../common/types";
import ActionMenu from "./ActionMenu";

interface Props {
  trackNumber: string | number;
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
}: Props) {
  const selectedTrackId = useUserStore((state) => state.selectedTrackId);

  const artist = track.artist || "Missing!";
  const trackTitle = track.title || "Missing!";
  const album = track.album || "Missing!";
  const { missingFile } = track;
  const highlightClass = track.id === selectedTrackId ? "text-green-500" : "";

  return (
    <div
      className={`group flex h-full p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all ${highlightClass} ${missingFile ? "bg-red-400" : ""}`}
      ref={provided?.innerRef}
      {...provided?.draggableProps}
    >
      <div className={"mr-1 min-w-8 text-right"}>{trackNumber}</div>

      <div {...provided?.dragHandleProps} className={"flex-grow"}>
        <button
          type="button"
          disabled={missingFile}
          className="line-clamp-1 font-bold text-left"
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
            to={`/artists/${artist}`}
          >
            {artist}
          </Link>
          {" - "}
          <Link
            className="text-neutral-600 hover:text-neutral-300 dark:text-neutral-400 hover:dark:text-neutral-300"
            to={`/artists/${track.albumArtist}/albums/${album}`}
          >
            <i>{album}</i>
          </Link>
        </span>
      </div>

      <div className="invisible group-hover:visible mr-2 flex basis-5 items-center dark:text-neutral-400 hover:dark:text-neutral-300">
        <ActionMenu tracks={[track]} />
      </div>

      <div className="basis-5">{track.formattedDuration}</div>
    </div>
  );
}
