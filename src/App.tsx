import { useEffect } from 'react';
import { BottomPanel } from '@/layout/BottomPanel/BottomPanel';
import Navbar from '@/layout/Navbar';
import { Player } from '@/layout/Player/Player';
import SidePanel from '@/layout/SidePanel';
import { denormalizeLibrary } from './hooks/denormalize';
import { useLibraryStore } from './hooks/useLibraryStore';
import { usePlaylistStore } from './hooks/usePlaylistStore';

// const useCacheData = () => {
// 	const { data: user, isLoading: isLoadingUser } = trpc.misc.me.useQuery();
// 	const { data: library, isLoading: isLoadingTracks } = trpc.library.list.useQuery();
// 	const {
// 		data: playlists,
// 		isLoading: isLoadingPlaylists,
// 	} = trpc.playlist.list.useQuery();
// 	const isLoading = isLoadingUser || isLoadingTracks || isLoadingPlaylists;

// 	useEffect(() => {
// 		if (library) {
// 			useLibraryStore.setState((state) => ({
// 				...state,
// 				...denormalizeLibrary(library),
// 			}));
// 		}
// 	}, [library]);

// 	useEffect(() => {
// 		if (playlists) {
// 			usePlaylistStore.setState((state) => ({ ...state, playlists }));
// 		}
// 	}, [playlists]);

// 	return { isLoading, user, library, playlists };
// };
