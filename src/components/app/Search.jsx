import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useMeasure } from "react-use";
import { FixedSizeList as List } from "react-window";
import { useAppStore } from "../../common/AppContextProvider";
import {
  setSelectedContextMenuId,
  useUserStore,
} from "../../common/UserContextProvider";
import MediaItem from "../MediaItem";
import TextInput from "../TextInput";

const Row = ({ data, index, style }) => (
  <div style={style}>
    <MediaItem playlistId={0} track={data[index]} trackNumber={index + 1} />
  </div>
);

const TrackListing = ({ tracks }) => {
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

  const getIndex = tracks.indexOf(
    tracks.find((track) => track.id === selectedTrackId),
  );

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

export default function Search() {
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const setSearchKeyDebounced = _.debounce(setSearchKey, 200);

  const tracks = useAppStore((state) => state.tracks);

  useEffect(() => {
    return function cleanup() {
      setSelectedContextMenuId(null);
    };
  }, []);

  useEffect(() => {
    const key = searchKey.toLowerCase();
    const filteredTracks =
      key.length > 0
        ? tracks.filter((track) => {
            return (
              track.title.toLowerCase().includes(key) ||
              track.artist.toLowerCase().includes(key) ||
              track.albumArtist.toLowerCase().includes(key) ||
              track.album.toLowerCase().includes(key)
            );
          })
        : tracks;

    setSearchResults(filteredTracks);
  }, [tracks, searchKey]);

  function handleSearchInput(e) {
    setSearchKeyDebounced(e.target.value);
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <section className="section flex flex-col">
        <form>
          <TextInput
            label="Search"
            leftIcon={<FaSearch color="gray" />}
            value={searchKey}
            onChange={handleSearchInput}
            horizontal={false}
            hideLabel={true}
            autoComplete="off"
          />
        </form>
      </section>

      <TrackListing tracks={searchResults} />
    </div>
  );
}
