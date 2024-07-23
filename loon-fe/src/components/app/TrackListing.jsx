import React, { useEffect, useRef } from "react";
import { useMeasure } from "react-use";
import { FixedSizeList as List } from "react-window";
import {
  setSelectedContextMenuId,
  useUserStore,
} from "../../common/UserContextProvider";
import MediaItem from "../MediaItem";

const Row = ({ data, index, style }) => (
  <div style={style}>
    <MediaItem playlistId={0} track={data[index]} trackNumber={index + 1} />
  </div>
);

export const TrackListing = ({ tracks }) => {
  const listRef = useRef();
  const [containerRef, { height: containerHeight }] = useMeasure();

  const selectedTrackId = useUserStore(
    (state) => state.userState.selectedTrackId,
  );
  const selectedTrackIndex = tracks.findIndex((t) => t.id === selectedTrackId);

  useEffect(() => {
    return function cleanup() {
      setSelectedContextMenuId(null);
    };
  }, []);

  useEffect(() => {
    listRef.current.scrollToItem(selectedTrackIndex, "smart");
  }, [selectedTrackIndex]);

  return (
    <div ref={containerRef} className="flex h-full flex-grow flex-col">
      <List
        ref={listRef}
        width="100%"
        height={containerHeight}
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
