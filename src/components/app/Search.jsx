import React, { useEffect, useRef, useState } from "react";
import MediaItem from "../MediaItem";
// import {
//   AutoSizer,
//   CellMeasurer,
//   CellMeasurerCache,
//   List,
// } from "react-virtualized";
import TextInput from "../TextInput";
import { FaSearch } from "react-icons/fa";
import { useAppStore } from "../../common/AppContextProvider";
import {
  useUserStore,
  setSelectedContextMenuId,
} from "../../common/UserContextProvider";
import _ from "lodash";

export default function Search() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const setSearchKeyDebounced = _.debounce(setSearchKey, 200);

  const tracks = useAppStore((state) => state.tracks);
  const selectedTrackId = useUserStore(
    (state) => state.userState.selectedTrackId
  );
  // const cache = useRef(
  //   new CellMeasurerCache({ fixedWidth: true, defaultHeight: 58 })
  // );
  // const listRef = useRef({});

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

  const scrollToIndex = searchResults.indexOf(
    searchResults.find((track) => track.id === selectedTrackId)
  );

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
        id="list"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          flex: "1",
          flexGrow: 1,
        }}
      >
        {searchResults.map((track, index) => <div>
          <MediaItem playlistId={0} track={track} trackNumber={index + 1} />
        </div>)}
        {/* <AutoSizer style={{ outline: 0 }}>
          {({ width, height }) => {
            return (
              <List
                ref={setListRef}
                width={width}
                height={height}
                deferredMeasurementCache={cache.current}
                rowHeight={cache.current.rowHeight}
                rowRenderer={renderRow}
                rowCount={searchResults.length}
                scrollToAlignment={"auto"}
                scrollToIndex={scrollToIndex}
                estimatedRowSize={58}
                overscanRowCount={3}
              />
            );
          }}
        </AutoSizer> */}
      </div>
    </div>
  );

  // function renderRow({ index, key, style, parent }) {
  //   const track = searchResults[index];
  //   return (
  //     <CellMeasurer
  //       key={key}
  //       cache={cache.current}
  //       parent={parent}
  //       columnIndex={0}
  //       rowIndex={index}
  //     >
  //       <div style={style}>
  //         <MediaItem playlistId={0} track={track} trackNumber={index + 1} />
  //       </div>
  //     </CellMeasurer>
  //   );
  // }

  // function setListRef(ref) {
  //   listRef.current = ref;
  // }
}
