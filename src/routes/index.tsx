import { AppWrap } from '@/main';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
	component: Index,
	ssr: false,
});

const queryClient = new QueryClient();

const persister = createAsyncStoragePersister({
	storage: window.localStorage,
	key: 'loon-REACT_QUERY_OFFLINE_CACHE',
});

function Index() {
	return (
		<PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
			<div className="flex flex-col min-h-screen bg-linear-to-r from-stone-900 to-neutral-950">
				<div className="grow flex flex-col h-full sm:px-4">
					<AppWrap />
				</div>
			</div>
		</PersistQueryClientProvider>
	);
}
