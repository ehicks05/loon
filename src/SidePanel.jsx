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
import { useAppStore } from "./common/AppContextProvider";
import { useUserStore } from "./common/UserContextProvider";

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

  const links = defaultLinks.map((link) => linkToNavLink(link));

  const playlistLinks = playlists
    .filter((playlist) => !playlist.favorites && !playlist.queue)
    .map((playlist) => playlistToLink(playlist))
    .map((link) => linkToNavLink(link));

  function playlistToLink(playlist) {
    return {
      path: `/playlists/${playlist.id}`,
      icon: <FaMusic />,
      text: playlist.name,
      currentlyPlaying: playlist.id === selectedPlaylistId,
    };
  }

  function linkToNavLink(link) {
    const currentlyPlayingIcon = link.currentlyPlaying ? (
      <span
        className="panel-icon has-text-success"
        style={{ marginLeft: ".75em" }}
        title={"Active Playlist"}
      >
        <FaVolumeUp aria-hidden="true" />
      </span>
    ) : null;

    return (
      <NavLink
        key={link.path}
        to={link.path}
        exact
        className={"panel-block"}
        activeClassName={"is-active"}
      >
        <span className="panel-icon">{link.icon}</span>
        {link.text}
        {currentlyPlayingIcon}
      </NavLink>
    );
  }

  return (
    <nav className={"panel"} style={{ maxWidth: "250px" }}>
      {links}
      {playlistLinks}
    </nav>
  );
}
