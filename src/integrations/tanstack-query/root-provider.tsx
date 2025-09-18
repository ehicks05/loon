import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const QUERY_CLIENT_OPTIONS = {
	defaultOptions: { queries: { staleTime: 1000 * 60 * 5, retry: false } },
};

export function getContext() {
	const queryClient = new QueryClient(QUERY_CLIENT_OPTIONS);
	return {
		queryClient,
	};
}

export function Provider({
	children,
	queryClient,
}: {
	children: React.ReactNode;
	queryClient: QueryClient;
}) {
	return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
