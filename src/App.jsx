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
      <div className="h-dvh flex flex-col">
        <Title />
        <Navbar />
        <div className={"flex flex-grow overflow-hidden"}>
          <div
            className={
              "hidden sm:block h-full w-60 overflow-y-auto overflow-x-hidden"
            }
          >
            <div className="h-full flex flex-col">
              <div className="overflow-y-auto">
                <SidePanel />
              </div>
              <div className="flex-grow"> </div>
              <div className="h-28">
                <canvas id="spectrumCanvas" height={100} width={150} />
              </div>
            </div>
          </div>
          <div
            className={
              "w-full overflow-y-auto overflow-x-hidden bg-neutral-100 dark:bg-neutral-900"
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
