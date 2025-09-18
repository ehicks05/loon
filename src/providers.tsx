import { AuthQueryProvider } from '@daveyplate/better-auth-tanstack';
import { AuthUIProviderTanstack } from '@daveyplate/better-auth-ui/tanstack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, useRouter } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { authClient } from './lib/auth-client';

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			retry: false,
		},
	},
});

export function Providers({ children }: { children: ReactNode }) {
	const router = useRouter();

	return (
		<QueryClientProvider client={queryClient}>
			<AuthQueryProvider>
				<AuthUIProviderTanstack
					authClient={authClient}
					navigate={(href) => router.navigate({ href })}
					replace={(href) => router.navigate({ href, replace: true })}
					Link={({ href, ...props }) => <Link to={href} {...props} />}
					credentials={false}
					social={{ providers: ['github'] }}
				>
					{children}
				</AuthUIProviderTanstack>
			</AuthQueryProvider>
		</QueryClientProvider>
	);
}
