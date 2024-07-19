import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import LoginForm from "./LoginForm";
import Navbar from "./Navbar";
import Routes from "./Routes";
import SidePanel from "./SidePanel";
import Title from "./Title";
import {
  fetchPlaylists,
  fetchTracks,
  useAppStore,
} from "./common/AppContextProvider";
import { fetchUser, useUserStore } from "./common/UserContextProvider";
import PlaybackControls from "./components/app/Player/PlaybackControls";
import Player from "./components/app/Player/Player";

import PageLoader from "@/common/PageLoader";
import usePoll from "./hooks/usePoll";

export default function App() {
  const [userLoading, setUserLoading] = useState(true);
  const [libraryLoading, setLibraryLoading] = useState(true);

  const user = useUserStore((state) => state.user);
  const tracks = useAppStore((state) => state.tracks);
  const playlists = useAppStore((state) => state.playlists);
  usePoll("/poll", 60 * 60 * 1000);

  // load user
  useEffect(() => {
    const fetch = async () => {
      await fetchUser();
      setUserLoading(false);
    };
    fetch();
  }, []);

  // load library
  useEffect(() => {
    const fetchLibrary = async () => {
      await fetchTracks();
      await fetchPlaylists();
      setLibraryLoading(false);
    };
    if (user && !userLoading && libraryLoading) fetchLibrary();
  }, [user, userLoading, libraryLoading]);

  if (!user && !userLoading) return <LoginForm />;
  if (!(user && tracks && playlists)) return <PageLoader />;

  return (
    <BrowserRouter>
      <div className="h-dvh flex flex-col text-neutral-300 bg-neutral-950">
        <Title />
        <Navbar />
        <div className={"flex flex-grow m-2 gap-2 overflow-hidden"}>
          <div
            className={
              "hidden sm:block h-full w-60 overflow-y-auto overflow-x-hidden"
            }
          >
            <div className="h-full flex flex-col justify-between">
              <div className="overflow-y-auto">
                <SidePanel />
              </div>
              <div className="h-28 rounded-lg p-2 bg-neutral-900">
                <canvas id="spectrumCanvas" height={"100%"} />
              </div>
            </div>
          </div>
          <div
            className={
              "w-full rounded-lg overflow-y-auto overflow-x-hidden p-2 bg-neutral-100 dark:bg-neutral-900"
            }
          >
            <Routes />
          </div>
        </div>
        <Player />
        <PlaybackControls />
      </div>
    </BrowserRouter>
  );
}
