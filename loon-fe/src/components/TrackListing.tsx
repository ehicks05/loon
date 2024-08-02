import { useUserStore } from "@/common/UserContextProvider";
import type { Track } from "@/common/types";
import { useEffect, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import { useResizeObserver } from "usehooks-ts";
import MediaItem from "./MediaItem";

const Row = ({
  data,
  index,
  style,
}: { data: Track[]; index: number; style: React.CSSProperties }) => (
  <div style={style}>
    <MediaItem playlistId={""} track={data[index]} trackNumber={index + 1} />
  </div>
);

interface Props {
  tracks: Track[];
}

export const TrackListing = ({ tracks }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { height: containerHeight } = useResizeObserver({ ref: containerRef });

  const listRef = useRef<List>(null);

  const selectedTrackId = useUserStore(
    (state) => state.userState.selectedTrackId,
  );
  const selectedTrackIndex = tracks.findIndex((t) => t.id === selectedTrackId);

  useEffect(() => {
    listRef.current?.scrollToItem(selectedTrackIndex, "smart");
  }, [selectedTrackIndex]);

  return (
    <div ref={containerRef} className="flex h-full flex-grow flex-col">
      <List
        ref={listRef}
        width="100%"
        height={containerHeight || 0}
        itemCount={tracks.length}
        itemData={tracks}
        itemKey={(i) => tracks[i].id}
        itemSize={60}
      >
        {Row}
      </List>
    </div>
  );
};
