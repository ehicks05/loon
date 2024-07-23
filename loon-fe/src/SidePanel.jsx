import React from "react";
import {
  FaCompactDisc,
  FaFolderOpen,
  FaHeart,
  FaList,
  FaMusic,
  FaSearch,
  FaUsers,
  FaVolumeUp,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAppStore } from "./common/AppContextProvider";
import { useUserStore } from "./common/UserContextProvider";

function playlistToLink(playlist, selectedPlaylistId, isPlaylist) {
  return {
    path: `/playlists/${playlist.id}`,
    icon: playlist.favorites ? (
      <FaHeart />
    ) : playlist.queue ? (
      <FaList />
    ) : (
      <FaMusic />
    ),
    text: playlist.name,
    currentlyPlaying: playlist.id === selectedPlaylistId,
    isPlaylist,
  };
}

const SidebarLink = ({ link, isPlaylist }) => {
  const location = useLocation();
  const isActive = location.pathname === link.path;

  return (
    <NavLink
      key={link.path}
      to={link.path}
      exact
      className={`flex gap-2 items-center p-2 ${isPlaylist ? "pl-6" : "pl-4"} rounded-lg hover:bg-neutral-800 transition-all ${isActive ? "text-white" : ""}`}
    >
      <span className="w-4 h-4">{link.icon}</span>
      {link.text}
      {link.currentlyPlaying && (
        <span className="w-4 h-4 text-green-500 ml-3" title={"Active Playlist"}>
          <FaVolumeUp aria-hidden="true" />
        </span>
      )}
    </NavLink>
  );
};

export default function SidePanel() {
  const playlists = useAppStore((state) => state.playlists);
  const selectedPlaylistId = useUserStore(
    (state) => state.userState.selectedPlaylistId,
  );

  if (!playlists) return <div>Loading...</div>;

  const defaultLinks = [
    {
      path: "/search",
      icon: <FaSearch />,
      text: "Search",
      currentlyPlaying: selectedPlaylistId === 0,
    },
    { path: "/artists", icon: <FaUsers />, text: "Artists" },
    { path: "/albums", icon: <FaCompactDisc />, text: "Albums" },
    { path: "/library", icon: <FaFolderOpen />, text: "Library" },
  ];

  const playlistLinks = playlists.map((playlist) =>
    playlistToLink(
      playlist,
      selectedPlaylistId,
      !playlist.favorites && !playlist.queue,
    ),
  );

  return (
    <nav className={"flex flex-col bg-neutral-900 rounded-lg"}>
      {defaultLinks.map((link) => (
        <SidebarLink key={link.path} link={link} />
      ))}
      {playlistLinks.map((link) => (
        <SidebarLink key={link.path} link={link} isPlaylist />
      ))}
    </nav>
  );
}
