import { TanStackDevtools } from '@tanstack/react-devtools';
import { type QueryClient, useQuery } from '@tanstack/react-query';
import {
	ClientOnly,
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { type ReactNode, useEffect } from 'react';
import appCss from '@/app.css?url';
import { denormalizeLibrary } from '@/hooks/denormalize';
import { fetchAndDenormalizeLibrary } from '@/hooks/fetchAndDenormalizeLibrary';
import { useLibraryStore } from '@/hooks/useLibraryStore';
import { usePlaylistStore } from '@/hooks/usePlaylistStore';
import { useTitle } from '@/hooks/useTitle';
import { BottomPanel } from '@/layout/BottomPanel/BottomPanel';
import { Navbar } from '@/layout/Navbar';
import { Player } from '@/layout/Player/Player';
import { Spectrum } from '@/layout/Player/spectrum';
import { SidePanel } from '@/layout/SidePanel';
import { orpc } from '@/orpc/client';
import { Providers } from '@/providers';
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ title: 'Loon' },
			{ name: 'mobile-web-app-capable', content: 'yes' },
			{ name: 'apple-mobile-web-app-capable', content: 'yes' },
			{ name: 'application-name', content: 'Loon' },
			{ name: 'apple-mobile-web-app-title', content: 'Loon' },
			{ name: 'theme-color', content: '#5b21b6' },
			{ name: 'msapplication-navbutton-color', content: '#5b21b6' },
			{
				name: 'apple-mobile-web-app-status-bar-style',
				content: 'black-translucent',
			},
			{ name: 'msapplication-starturl', content: '/' },
		],
		links: [
			{ rel: 'stylesheet', href: appCss },
			{ rel: 'icon', href: '/loon.ico', type: 'image/ico' },
			{ rel: 'apple-touch-icon', href: 'apple-touch-icon.png', type: 'image/ico' },
			{ rel: 'preconnect', href: 'https://fonts.googleapis.com' },
			{
				rel: 'preconnect',
				href: 'https://fonts.gstatic.com',
				crossOrigin: 'anonymous',
			},
			{
				rel: 'stylesheet',
				href: 'https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100..900;1,100..900&display=swap',
			},
			{ rel: 'manifest', href: '/manifest.json' },
		],
	}),
	shellComponent: RootDocument,
	errorComponent: ({ error }) => <div>uh oh: {error.message}</div>,
	notFoundComponent: () => <div>not found...</div>,
	loader: async () => {
		const library = await fetchAndDenormalizeLibrary();
		const playlists = await orpc.playlist.list.call();
		return { library, playlists };
	},
	ssr: false,
});

const useCacheData = () => {
	const { data: library, isLoading: isLoadingTracks } = useQuery({
		...orpc.library.list.queryOptions(),
	});
	const { data: playlists, isLoading: isLoadingPlaylists } = useQuery({
		...orpc.playlist.list.queryOptions(),
	});

	const isLoading = isLoadingTracks || isLoadingPlaylists;

	useEffect(() => {
		if (library) {
			useLibraryStore.setState(() => denormalizeLibrary(library));
		}
	}, [library]);

	useEffect(() => {
		if (playlists) {
			usePlaylistStore.setState((state) => ({ ...state, playlists }));
		}
	}, [playlists]);

	return { isLoading, library, playlists };
};

function RootComponent({ children }: Readonly<{ children: ReactNode }>) {
	useTitle();
	useCacheData();

	const { isLoading: isLoadingLibrary } = useQuery(orpc.library.list.queryOptions());
	const { isLoading: isLoadingPlaylists } = useQuery(
		orpc.playlist.list.queryOptions(),
	);
	const tracks = useLibraryStore((state) => state.tracks);
	if (isLoadingLibrary || isLoadingPlaylists) return null;

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
							<Spectrum />
						</div>
					</div>
				</div>
				<div className="w-full max-w-screen-lg rounded-lg overflow-y-auto overflow-x-hidden p-2 bg-neutral-900">
					{/* {!tracks && (
						<div className="flex flex-col gap-4 p-4 -m-2 bg-red-600 rounded-lg">
							<div className="text-3xl">Uh oh!</div>
							<div className="text-lg">Unable to fetch the music library!</div>
						</div>
					)} */}
					{children}
				</div>
			</div>

			{tracks.length && <Player />}
			<BottomPanel />
		</div>
	);
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body className="dark">
				<ClientOnly>
					<Providers>
						<RootComponent>{children}</RootComponent>
					</Providers>

					{/* <TanStackDevtools
						config={{ position: 'bottom-left' }}
						plugins={[
							{ name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
							TanStackQueryDevtools,
						]}
					/> */}
				</ClientOnly>
				<Scripts />
			</body>
		</html>
	);
}
