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

function playlistToLink(playlist, selectedPlaylistId) {
  return {
    path: `/playlists/${playlist.id}`,
    icon: <FaMusic />,
    text: playlist.name,
    currentlyPlaying: playlist.id === selectedPlaylistId,
  };
}

const SidebarLink = ({ link }) => {
  const location = useLocation();
  const isActive = location.pathname === link.path;

  return (
    <NavLink
      key={link.path}
      to={link.path}
      exact
      className={`flex gap-2 items-center p-2 pl-4 rounded-lg hover:bg-neutral-700 ${isActive ? "text-white" : ""}`}
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
    {
      path: "/favorites",
      icon: <FaHeart />,
      text: "Favorites",
      currentlyPlaying:
        selectedPlaylistId ===
        playlists.find((playlist) => playlist.favorites).id,
    },
    {
      path: "/queue",
      icon: <FaList />,
      text: "Queue",
      currentlyPlaying:
        selectedPlaylistId === playlists.find((playlist) => playlist.queue).id,
    },
    { path: "/artists", icon: <FaUsers />, text: "Artists" },
    { path: "/albums", icon: <FaCompactDisc />, text: "Albums" },
    { path: "/playlists", icon: <FaFolderOpen />, text: "Playlists" },
  ];

  const playlistLinks = playlists
    .filter((playlist) => !playlist.favorites && !playlist.queue)
    .map((playlist) => playlistToLink(playlist, selectedPlaylistId));

  return (
    <nav className={"flex flex-col bg-neutral-900 rounded-lg"}>
      {defaultLinks.map((link) => (
        <SidebarLink key={link.path} link={link} />
      ))}
      {playlistLinks.map((link) => (
        <SidebarLink key={link.path} link={link} />
      ))}
    </nav>
  );
}
