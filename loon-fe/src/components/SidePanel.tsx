import { useAppStore } from "@/common/AppContextProvider";
import { useUserStore } from "@/common/UserContextProvider";
import type { Playlist } from "@/common/types";
import type { ReactNode } from "react";
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

interface PlaylistLink {
  path: string;
  icon: ReactNode;
  text: string;
  currentlyPlaying?: boolean;
}

function playlistToLink(playlist: Playlist, selectedPlaylistId: string) {
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
  };
}

interface SidebarLinkProps {
  link: PlaylistLink;
  isPlaylist?: boolean;
}

const SidebarLink = ({ link, isPlaylist }: SidebarLinkProps) => {
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
      currentlyPlaying: selectedPlaylistId === "",
    },
    { path: "/artists", icon: <FaUsers />, text: "Artists" },
    { path: "/albums", icon: <FaCompactDisc />, text: "Albums" },
    { path: "/library", icon: <FaFolderOpen />, text: "Library" },
  ];

  const favorites = playlists.find((p) => p.favorites);
  const queue = playlists.find((p) => p.queue);
  const rest = playlists
    .filter((p) => !p.favorites && !p.queue)
    .sort((o1, o2) => o1.id.localeCompare(o2.id));
  const playlistLinks = [favorites, queue, ...rest]
    .filter((o): o is Playlist => !!o)
    .map((playlist) => playlistToLink(playlist, selectedPlaylistId));

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
