import type { DraggableProvided } from "@hello-pangea/dnd";
import { useUserStore } from "../common/UserContextProvider";
import type { Track } from "../common/types";

interface Props {
  trackNumber: number;
  track: Track;
  provided: DraggableProvided;
}

export default function DraggingMediaItem({
  trackNumber,
  track,
  provided,
}: Props) {
  const selectedTrackId = useUserStore((state) => state.selectedTrackId);

  const artist = track.artist || "Missing!";
  const trackTitle = track.title || "Missing!";
  const album = track.album || "Missing!";
  const { missingFile } = track;

  const highlightClass =
    track.id === selectedTrackId ? "text-green-500" : "text-neutral-300";

  return (
    <div
      id={`track${track.id}`}
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`select-none border border-neutral-500 bg-neutral-800 ${highlightClass}`}
    >
      <div
        className={`group flex p-1 transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 ${missingFile ? "text-red-500" : null}`}
      >
        <div className="mr-1 min-w-8 text-right">{trackNumber}</div>

        <div {...provided.dragHandleProps} className="flex-grow">
          <div className="line-clamp-1 font-bold">{trackTitle}</div>

          {missingFile && (
            <span className="tag is-normal is-danger ml-4">Track Missing</span>
          )}
          <span className="line-clamp-1 text-sm text-neutral-400">
            {artist} - <i>{album}</i>
          </span>
        </div>

        <div className="mr-2 flex basis-5 items-center" />

        <div className="basis-5">{track.formattedDuration}</div>
      </div>
    </div>
  );
}
