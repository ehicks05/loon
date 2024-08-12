import { useAppStore } from "@/common/AppContextProvider";
import { useUserStore } from "@/common/UserContextProvider";
import type { Playlist } from "@/common/types";
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
import type { IconType } from "react-icons/lib";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface PlaylistLink {
  path: string;
  icon: IconType;
  text: string;
  currentlyPlaying?: boolean;
}

function playlistToLink(playlist: Playlist, selectedPlaylistId: string) {
  return {
    path: `/playlists/${playlist.id}`,
    icon: playlist.favorites ? FaHeart : playlist.queue ? FaList : FaMusic,
    text: playlist.name,
    currentlyPlaying: playlist.id === selectedPlaylistId,
  };
}

interface SidebarLinkProps {
  link: PlaylistLink;
  isPlaylist?: boolean;
}

const SidebarLink = ({
  link: { path, text, icon: Icon, currentlyPlaying },
  isPlaylist,
}: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  const linkClasses = `flex items-center justify-between p-2 ${isPlaylist ? "pl-6" : "pl-4"} hover:bg-neutral-800 transition-all rounded-lg`;

  return (
    <Link key={path} to={path} className={linkClasses}>
      <div
        className={`flex gap-2 items-center ${isActive ? "text-white" : ""}`}
      >
        <Icon />
        {text}
      </div>
      {currentlyPlaying && (
        <FaVolumeUp className="text-green-500" title="Now Playing" />
      )}
    </Link>
  );
};

export default function SidePanel() {
  const playlists = useAppStore((state) => state.playlists);
  const selectedPlaylistId = useUserStore((state) => state.selectedPlaylistId);

  const defaultLinks = [
    {
      path: "/search",
      icon: FaSearch,
      text: "Search",
      currentlyPlaying: selectedPlaylistId === "",
    },
    { path: "/artists", icon: FaUsers, text: "Artists" },
    { path: "/albums", icon: FaCompactDisc, text: "Albums" },
    { path: "/library", icon: FaFolderOpen, text: "Library" },
  ];

  const playlistLinks = playlists
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
