import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

import { useWindowSize } from "react-use";
import Header from "./Header";
import LoginForm from "./LoginForm";
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
  const [columnHeight, setColumnHeight] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [libraryLoading, setLibraryLoading] = useState(true);

  const user = useUserStore((state) => state.user);
  const tracks = useAppStore((state) => state.tracks);
  const playlists = useAppStore((state) => state.playlists);
  const { width, height } = useWindowSize();
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

  useEffect(() => {
    const headerHeight = 56;
    const progressBarHeight = 23;
    const footerHeight = progressBarHeight + (width <= 768 ? 111 : 62);
    const columnHeight = `${height - (headerHeight + footerHeight)}px`;
    setColumnHeight(columnHeight);
  }, [width, height]);

  if (!user && !userLoading) return <LoginForm />;

  if (!(user && tracks && playlists)) return <PageLoader />;

  return (
    <BrowserRouter>
      <Title />
      <Header />
      <div className={"columns is-gapless"}>
        <div
          id="left-column"
          style={{ height: columnHeight, overflow: "hidden auto" }}
          className={"column is-narrow is-hidden-touch"}
        >
          <div
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div style={{ overflowY: "auto" }}>
              <SidePanel />
            </div>
            <div style={{ flex: "1 1 auto" }}> </div>
            <div style={{ height: "100px" }}>
              <canvas id="spectrumCanvas" height={100} width={150} />
            </div>
          </div>
        </div>
        <div
          className="column"
          style={{ height: columnHeight, overflow: "hidden auto" }}
        >
          <Routes />
        </div>
      </div>
      <Player />
      <PlaybackControls />
    </BrowserRouter>
  );
}
