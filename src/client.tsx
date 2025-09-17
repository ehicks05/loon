import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { StartClient } from '@tanstack/react-start';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createRouter } from './router';

const queryClient = new QueryClient();

const persister = createAsyncStoragePersister({
	storage: window.localStorage,
	key: 'loon-REACT_QUERY_OFFLINE_CACHE',
});

const router = createRouter();

hydrateRoot(
	document,
	<StrictMode>
		<PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
			<StartClient router={router} />
		</PersistQueryClientProvider>
	</StrictMode>,
);
