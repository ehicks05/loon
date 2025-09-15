import { useEffect } from 'react';
import { BottomPanel } from '@/components/BottomPanel/BottomPanel';
import Navbar from '@/components/Navbar';
import { Player } from '@/components/Player/Player';
import SidePanel from '@/components/SidePanel';
import { MediaColumn } from './components/MediaColumn/MediaColumn';
import { PageLoader } from './components/PageLoader';
import { denormalizeLibrary } from './hooks/denormalize';
import { useLibraryStore } from './hooks/useLibraryStore';
import { usePlaylistStore } from './hooks/usePlaylistStore';
import { useTitle } from './hooks/useTitle';
import Routes from './Routes';
import { trpc } from './utils/trpc';

const useCacheData = () => {
	const { data: user, isLoading: isLoadingUser } = trpc.misc.me.useQuery();
	const { data: library, isLoading: isLoadingTracks } = trpc.library.list.useQuery();
	const {
		data: playlists,
		isLoading: isLoadingPlaylists,
		refetch: refetchPlaylists,
	} = trpc.playlist.list.useQuery();
	const isLoading = isLoadingUser || isLoadingTracks || isLoadingPlaylists;

	useEffect(() => {
		if (user) refetchPlaylists();
		if (!user) refetchPlaylists();
	}, [user, refetchPlaylists]);

	useEffect(() => {
		if (library) {
			useLibraryStore.setState((state) => ({
				...state,
				...denormalizeLibrary(library),
			}));
		}
	}, [library]);

	useEffect(() => {
		if (playlists) {
			usePlaylistStore.setState((state) => ({ ...state, playlists }));
		}
	}, [playlists]);

	return { isLoading, user, library, playlists };
};

export default function App() {
	useTitle();
	useCacheData();
	const { data: { tracks } = {}, isLoading } = trpc.library.list.useQuery();
	const { tracks: trackz } = useLibraryStore();

	if (isLoading) {
		return <PageLoader />;
	}

	return (
		<div className="h-dvh flex flex-col text-neutral-300 bg-neutral-950">
			<Navbar />
			<div className="flex flex-grow m-2 gap-2 justify-center overflow-hidden">
				<div className="hidden flex-shrink-0 md:block h-full w-60 overflow-y-auto overflow-x-hidden">
					<div className="h-full flex flex-col justify-between">
						<div className="overflow-y-auto">
							<SidePanel />
						</div>
						<div className="h-28 rounded-lg p-2 bg-neutral-900">
							<canvas id="spectrumCanvas" height={'100%'} />
						</div>
					</div>
				</div>
				<div className="w-full max-w-screen-lg rounded-lg overflow-y-auto overflow-x-hidden p-2 bg-neutral-900">
					{!tracks && (
						<div className="flex flex-col gap-4 p-4 -m-2 bg-red-600 rounded-lg">
							<div className="text-3xl">Uh oh!</div>
							<div className="text-lg">Unable to fetch the music library!</div>
						</div>
					)}
					{tracks && tracks.length === trackz.length && <Routes />}
				</div>
				<MediaColumn />
			</div>
			{trackz.length !== 0 && <Player />}
			<BottomPanel />
		</div>
	);
}
