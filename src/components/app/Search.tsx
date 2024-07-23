import _ from "lodash";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { type Track, useAppStore } from "../../common/AppContextProvider";
import { setSelectedContextMenuId } from "../../common/UserContextProvider";
import { trpc } from "../../utils/trpc";
import TextInput from "../TextInput";
import { TrackListing } from "./TrackListing";

export default function Search() {
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const setSearchKeyDebounced = _.debounce(setSearchKey, 200);

  const tracks = useAppStore((state) => state.tracks);

  const { data } = trpc.playlist.list.useQuery();

  console.log(data);

  useEffect(() => {
    return function cleanup() {
      setSelectedContextMenuId("");
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
      <TextInput
        label="Search"
        leftIcon={<FaSearch color="gray" />}
        value={searchKey}
        onChange={handleSearchInput}
        isHorizontal={false}
        hideLabel={true}
        autoComplete="off"
      />

      <TrackListing tracks={searchResults} />
    </div>
  );
}
