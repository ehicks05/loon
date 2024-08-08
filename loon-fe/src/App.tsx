import { BottomPanel } from "@/components/BottomPanel/BottomPanel";
import Navbar from "@/components/Navbar";
import Player from "@/components/Player/Player";
import SidePanel from "@/components/SidePanel";
import { useEffect } from "react";
import { useInterval } from "usehooks-ts";
import Routes from "./Routes";
import { useAppStore } from "./common/AppContextProvider";
import PageLoader from "./common/PageLoader";
import type { RawTrackResponse } from "./common/types";
import { formatTime } from "./components/utils";
import { useTitle } from "./hooks/useTitle";
import { trpc } from "./utils/trpc";

const addFormattedDuration = (track: RawTrackResponse) => ({
  ...track,
  formattedDuration: formatTime(track.duration),
});

const useCacheData = () => {
  const { data: user, isLoading: isLoadingUser } = trpc.misc.me.useQuery();
  const { data: tracks, isLoading: isLoadingTracks } =
    trpc.tracks.list.useQuery();
  const {
    data: playlists,
    isLoading: isLoadingPlaylists,
    refetch: refetchPlaylists,
  } = trpc.playlist.list.useQuery();
  const isLoading = isLoadingUser || isLoadingTracks || isLoadingPlaylists;

  useEffect(() => {
    if (user) refetchPlaylists();
    if (!user) refetchPlaylists();
  }, [user, refetchPlaylists]);

  useEffect(() => {
    if (tracks) {
      useAppStore.setState((state) => ({
        ...state,
        tracks: tracks.map(addFormattedDuration),
      }));
    }
  }, [tracks]);

  useEffect(() => {
    if (playlists) {
      useAppStore.setState((state) => ({ ...state, playlists }));
    }
  }, [playlists]);

  return { isLoading, user, tracks, playlists };
};

export default function App() {
  useInterval(() => fetch("/poll"), 1000 * 60 * 60);
  useTitle();
  const { isLoading } = useCacheData();
  const tracks = useAppStore((state) => state.tracks);

  if (isLoading || !tracks) {
    return <PageLoader />;
  }

  return (
    <div className="h-dvh flex flex-col text-neutral-300 bg-neutral-950">
      <Navbar />
      <div className={"flex flex-grow m-2 gap-2 overflow-hidden"}>
        <div className="hidden sm:block h-full w-60 overflow-y-auto overflow-x-hidden">
          <div className="h-full flex flex-col justify-between">
            <div className="overflow-y-auto">
              <SidePanel />
            </div>
            <div className="h-28 rounded-lg p-2 bg-neutral-900">
              <canvas id="spectrumCanvas" height={"100%"} />
            </div>
          </div>
        </div>
        <div className="w-full rounded-lg overflow-y-auto overflow-x-hidden p-2 bg-neutral-100 dark:bg-neutral-900">
          <Routes />
        </div>
      </div>
      <Player />
      <BottomPanel />
    </div>
  );
}
