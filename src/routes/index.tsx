import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { AppWrap } from '@/main';
import { orpc } from '@/orpc/client';

export const Route = createFileRoute('/')({
	component: Index,
	ssr: false,
});

function Index() {
	const { data } = useQuery(orpc.listLibrary.queryOptions({input:{}}));

	return (
		<div className="flex flex-col min-h-screen bg-linear-to-r from-stone-900 to-neutral-950">
			<div className="grow flex flex-col h-full sm:px-4">
				{data?.albums.length} albums...
				{data?.albums.map(o => o.name)}
				{/* <AppWrap /> */}
			</div>
		</div>
	);
}
