import { useAppStore } from "@/common/AppContextProvider";
import { setSelectedContextMenuId } from "@/common/UserContextProvider";
import type { Track } from "@/types/trpc";
import { TextInput } from "@/components/TextInput";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDebounceValue } from "usehooks-ts";
import { TrackListing } from "../components/TrackListing";

export default function Search() {
  const [searchKey, setSearchKey] = useState("");
  const [debouncedSearchKey, setDebouncedSearchKey] = useDebounceValue(
    searchKey,
    300,
  );
  const [searchResults, setSearchResults] = useState<Track[]>([]);

  const tracks = useAppStore((state) => state.tracks);

  useEffect(() => {
    return function cleanup() {
      setSelectedContextMenuId("");
    };
  }, []);

  useEffect(() => {
    const key = debouncedSearchKey.toLowerCase();
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
  }, [tracks, debouncedSearchKey]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TextInput
        leftIcon={<FaSearch color="gray" />}
        value={searchKey}
        onChange={(e) => {
          setSearchKey(e.target.value);
          setDebouncedSearchKey(e.target.value);
        }}
        isHorizontal={false}
        autoComplete="off"
      />

      <TrackListing tracks={searchResults} />
    </div>
  );
}
