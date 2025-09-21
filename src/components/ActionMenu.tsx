import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useMutation } from '@tanstack/react-query';
import { partition } from 'es-toolkit';
import type { ReactNode } from 'react';
import {
	FaChevronRight,
	FaEllipsisH,
	FaHeart,
	FaList,
	FaRegHeart,
} from 'react-icons/fa';
import { usePlaylistStore } from '@/hooks/usePlaylistStore';
import { usePlaylists } from '@/hooks/usePlaylists';
import { orpc } from '@/orpc/client';
import type { Playlist } from '@/orpc/types';

const isSaturated = (playlist: Playlist, trackIds: string[]) => {
	const playlistTrackIds = playlist.playlistTracks.map(({ trackId }) => trackId);
	return trackIds.every((trackId) => playlistTrackIds.includes(trackId));
};

export default function ActionMenu({ trackIds }: { trackIds: string[] }) {
	// todo: utils.playlist.list.invalidate();
	const { mutate } = useMutation(orpc.playlist.update.mutationOptions());

	const { data } = usePlaylists();
	const playlists = data?.playlists || [];

	const favoritesPlaylist = playlists.find((playlist) => playlist.favorites);
	const isFavorite = favoritesPlaylist && isSaturated(favoritesPlaylist, trackIds);

	const queuePlaylist = playlists.find((playlist) => playlist.queue);
	const isQueued = queuePlaylist && isSaturated(queuePlaylist, trackIds);

	const regularPlaylists = playlists.filter(
		(playlist) => !playlist.favorites && !playlist.queue,
	);

	const [saturatedPlaylists, unsaturatedPlaylists] = partition(
		regularPlaylists,
		(playlist) => isSaturated(playlist, trackIds),
	);

	if (!favoritesPlaylist || !queuePlaylist) {
		return null;
	}

	function getUpdatedTrackList(mode: 'add' | 'remove', playlist: Playlist) {
		const playlistTrackIds = playlist.playlistTracks.map(({ trackId }) => trackId);

		return mode === 'add'
			? [...new Set([...playlistTrackIds, ...trackIds])]
			: playlistTrackIds.filter((trackId) => !trackIds.includes(trackId));
	}

	const handleFavorites = () => {
		mutate({
			id: favoritesPlaylist.id,
			trackIds: getUpdatedTrackList(
				isFavorite ? 'remove' : 'add',
				favoritesPlaylist,
			),
		});
	};
	const favoritesIcon = isFavorite ? (
		<FaHeart className="w-4 text-green-500" />
	) : (
		<FaRegHeart className="w-4" />
	);

	const handleQueue = () => {
		mutate({
			id: queuePlaylist.id,
			trackIds: getUpdatedTrackList(isQueued ? 'remove' : 'add', queuePlaylist),
		});
	};
	const queueIcon = <FaList className={`w-4 ${isQueued ? 'text-green-500' : ''}`} />;

	const subMenus = [
		{
			playlists: unsaturatedPlaylists,
			disabled: unsaturatedPlaylists.length === 0,
			label: 'Add to...',
			verb: 'add',
		},
		{
			playlists: saturatedPlaylists,
			disabled: saturatedPlaylists.length === 0,
			label: 'Remove from...',
			verb: 'remove',
		},
	] as const;

	const itemClass =
		'flex items-center gap-2 px-2 py-1 rounded cursor-pointer focus-visible:outline-none focus-visible:bg-neutral-700';

	return (
		<Wrapper>
			<DropdownMenu.Item
				className={itemClass}
				onSelect={(e) => {
					e.preventDefault();
					handleFavorites();
				}}
			>
				{favoritesIcon}
				{isFavorite ? 'Remove from' : 'Add to'} Favorites
			</DropdownMenu.Item>
			<DropdownMenu.Item
				className={itemClass}
				onSelect={(e) => {
					e.preventDefault();
					handleQueue();
				}}
			>
				{queueIcon}
				{isQueued ? 'Remove from' : 'Add to'} Queue
			</DropdownMenu.Item>

			<DropdownMenu.Separator className="h-0.5 m-1 bg-neutral-500" />

			{subMenus.map(({ playlists, disabled, label, verb }) => (
				<DropdownMenu.Sub key={verb}>
					<DropdownMenu.SubTrigger
						disabled={disabled}
						className={`${itemClass} ${disabled ? 'cursor-not-allowed text-neutral-400' : ''}`}
					>
						<div className="flex gap-8 w-full items-center justify-between">
							<span>{label}</span>
							{!disabled && <FaChevronRight size={12} />}
						</div>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.Portal>
						<DropdownMenu.SubContent className="flex flex-col p-1 text-sm rounded-lg bg-neutral-800">
							{playlists.map((playlist) => (
								<DropdownMenu.Item
									key={playlist.id}
									className={itemClass}
									onSelect={(e) => {
										e.preventDefault();
										mutate({
											id: playlist.id,
											trackIds: getUpdatedTrackList(verb, playlist),
										});
									}}
								>
									{playlist.name}
								</DropdownMenu.Item>
							))}
						</DropdownMenu.SubContent>
					</DropdownMenu.Portal>
				</DropdownMenu.Sub>
			))}
		</Wrapper>
	);
}

const Wrapper = ({ children }: { children: ReactNode }) => {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger className="p-2 focus-visible:outline-none">
				<FaEllipsisH />
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content className="flex flex-col p-1 text-sm rounded-lg bg-neutral-800">
					{children}

					<DropdownMenu.Arrow />
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};
