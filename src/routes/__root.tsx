import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import type { ReactNode } from 'react';
import Header from '@/components/Header';
import appCss from '@/styles/app.css?url';
import ClerkProvider from '../integrations/clerk/provider';
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
});

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<ClerkProvider>
					<Header />

					{children}

					<TanStackDevtools
						config={{
							position: 'bottom-left',
						}}
						plugins={[
							{
								name: 'Tanstack Router',
								render: <TanStackRouterDevtoolsPanel />,
							},
							TanStackQueryDevtools,
						]}
					/>
				</ClerkProvider>
				<Scripts />
			</body>
		</html>
	);
}
