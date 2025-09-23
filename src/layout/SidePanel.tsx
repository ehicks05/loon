import { Link, useLocation } from '@tanstack/react-router';
import {
	Disc3,
	FolderOpen,
	Heart,
	List,
	ListMusic,
	type LucideIcon,
	MicVocal,
	Search,
	Volume2,
} from 'lucide-react';
import { usePlaylistStore } from '@/hooks/usePlaylistStore';
import { useUserStore } from '@/hooks/useUserStore';
import type { Playlist } from '@/orpc/types';

interface PlaylistLink {
	path: string;
	icon: LucideIcon;
	text: string;
	currentlyPlaying?: boolean;
}

function playlistToLink(playlist: Playlist, selectedPlaylistId: string) {
	return {
		path: `/playlists/${playlist.id}`,
		icon: playlist.favorites ? Heart : playlist.queue ? List : ListMusic,
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
	const linkClasses = `flex items-center justify-between p-2 ${isPlaylist ? 'pl-6' : 'pl-4'} hover:bg-neutral-800 transition-all rounded-lg`;

	return (
		<Link key={path} to={path} className={linkClasses}>
			<div className={`flex gap-2 items-center ${isActive ? 'text-white' : ''}`}>
				<Icon size={16} />
				{text}
			</div>
			{currentlyPlaying && (
				<Volume2 className="text-green-500" aria-label="Now Playing" size={16} />
			)}
		</Link>
	);
};

export function SidePanel() {
	const { playlists } = usePlaylistStore();
	const { selectedPlaylistId } = useUserStore();

	const defaultLinks = [
		{
			path: '/search',
			icon: Search,
			text: 'Search',
			currentlyPlaying: selectedPlaylistId === '',
		},
		{ path: '/artists', icon: MicVocal, text: 'Artists' },
		{ path: '/albums', icon: Disc3, text: 'Albums' },
		{ path: '/playlists', icon: FolderOpen, text: 'Library' },
	];

	const playlistLinks = playlists
		.filter((o): o is Playlist => !!o)
		.map((playlist) => playlistToLink(playlist, selectedPlaylistId));

	return (
		<nav className={'flex flex-col bg-neutral-900 rounded-lg'}>
			{defaultLinks.map((link) => (
				<SidebarLink key={link.path} link={link} />
			))}
			{playlistLinks.map((link) => (
				<SidebarLink key={link.path} link={link} isPlaylist />
			))}
		</nav>
	);
}
