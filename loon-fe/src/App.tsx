import React, { useEffect } from "react";
import { BrowserRouter, useHistory, useLocation } from "react-router-dom";

import Navbar from "./Navbar";
import Routes from "./Routes";
import SidePanel from "./SidePanel";
import { useAppStore } from "./common/AppContextProvider";
import {
  fetchUser,
  useUserStore,
  useUserStore2,
} from "./common/UserContextProvider";
import PlaybackControls from "./components/app/Player/PlaybackControls";
import Player from "./components/app/Player/Player";

import { useInterval } from "usehooks-ts";
import PageLoader from "./common/PageLoader";
import { formatTime } from "./components/utils";
import { useTitle } from "./hooks/useTitle";
import { trpc } from "./utils/trpc";

const useCacheData = () => {
  const { data: user, isLoading: isLoadingUser } = trpc.misc.me.useQuery();
  const { data: tracks, isLoading: isLoadingTracks } =
    trpc.tracks.list.useQuery();
  const { data: playlists, isLoading: isLoadingPlaylists } =
    trpc.playlist.list.useQuery();
  const isLoading = isLoadingUser || isLoadingTracks || isLoadingPlaylists;

  useEffect(() => {
    if (user) {
      useUserStore2.setState((state) => ({ ...state, user }));
    }

    if (tracks && playlists) {
      useAppStore.setState((state) => ({
        ...state,
        tracks: tracks.map((track) => ({
          ...track,
          formattedDuration: formatTime(track.duration),
        })),
        playlists,
      }));
    }
  }, [user, tracks, playlists]);

  return { isLoading, user, tracks, playlists };
};

export default function App() {
  useInterval(() => fetch("/poll"), 1000 * 60 * 60);
  useTitle();
  const { isLoading, user, tracks, playlists } = useCacheData();
  const history = useHistory();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user || !tracks.length || !playlists.length) {
    console.log({ user, t: tracks.length, p: playlists.length });
    history.push("/login/github");
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
      <PlaybackControls />
    </div>
  );
}
