import { ClerkProvider } from '@clerk/clerk-react';
import { env } from '@/env';

const PUBLISHABLE_KEY = env.CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
	throw new Error('Add your Clerk Publishable Key to the .env.local file');
}

interface Props {
	children: React.ReactNode;
}

export default function AppClerkProvider({ children }: Props) {
	return (
		<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
			{children}
		</ClerkProvider>
	);
}
