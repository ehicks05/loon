import React, { useEffect, useRef } from "react";
import { useMeasure } from "react-use";
import { FixedSizeList as List } from "react-window";
import { useAppStore } from "../../common/AppContextProvider";
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

  useEffect(() => {
    return function cleanup() {
      setSelectedContextMenuId(null);
    };
  }, []);

  const scrollToIndex = () => {
    const index = tracks.find((track) => track.id === selectedTrackId);
    listRef.current.scrollToItem(index, "center");
  };

  return (
    <div ref={containerRef} className="flex h-full flex-grow flex-col">
      <List
        ref={listRef}
        width="100%"
        height={containerHeight}
        itemCount={tracks.length}
        itemData={tracks}
        itemKey={(_index, data) => data.id}
        itemSize={60}
      >
        {Row}
      </List>
    </div>
  );
};
