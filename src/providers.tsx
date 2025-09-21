import { AuthQueryProvider } from '@daveyplate/better-auth-tanstack';
import { AuthUIProviderTanstack } from '@daveyplate/better-auth-ui/tanstack';
import { Link, useRouter } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { authClient } from './lib/auth-client';

export function Providers({ children }: { children: ReactNode }) {
	const router = useRouter();

	return (
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
	);
}
