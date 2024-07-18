import React, { useEffect, useRef, useState } from "react";
import { FixedSizeList as List } from 'react-window';
import MediaItem from "../MediaItem";
import TextInput from "../TextInput";
import { FaSearch } from "react-icons/fa";
import { useAppStore } from "../../common/AppContextProvider";
import {
  useUserStore,
  setSelectedContextMenuId,
} from "../../common/UserContextProvider";
import _ from "lodash";

const Row = ({ data, index, style }) => {
  const track = data[index];

  return <div style={style}>
    <MediaItem playlistId={0} track={track} trackNumber={index + 1} />
  </div>
}

export default function Search() {
  const listRef = useRef();
  const [searchResults, setSearchResults] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const setSearchKeyDebounced = _.debounce(setSearchKey, 200);

  const tracks = useAppStore((state) => state.tracks);
  const selectedTrackId = useUserStore(
    (state) => state.userState.selectedTrackId
  );

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

  const getIndex = searchResults.indexOf(
    searchResults.find((track) => track.id === selectedTrackId)
  );

  const scrollToIndex = () => listRef.current.scrollToItem(getIndex(), "center");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flex: "1",
        overflow: "hidden",
      }}
    >
      <section
        className={"section"}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <form>
          <TextInput
            id={"searchInput"}
            label={"Search"}
            leftIcon={<FaSearch color={"gray"} />}
            value={searchKey}
            onChange={handleSearchInput}
            horizontal={false}
            hideLabel={true}
            autoComplete="off"
          />
        </form>
      </section>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          flex: "1",
          flexGrow: 1,
        }}
      >
        <List
          ref={listRef}
          width={'100%'}
          height={800}
          itemCount={searchResults.length}
          itemData={searchResults}
          itemKey={(_index, data) => data.id}
          itemSize={60}
        >
          {Row}
        </List>
      </div>
    </div>
  );
}
