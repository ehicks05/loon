import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { AppWrap } from '@/main';

export const Route = createFileRoute('/')({
	component: Index,
	ssr: false,
});

function Index() {
	const { data } = useQuery({
		queryKey: ['hello'],
		queryFn: async () => {
			const response = await fetch('/api/hello');
			const text = await response.text();
			return text;
		},
	});

	return (
		<div className="flex flex-col min-h-screen bg-linear-to-r from-stone-900 to-neutral-950">
			<div className="grow flex flex-col h-full sm:px-4">
				{data}
				<AppWrap />
			</div>
		</div>
	);
}
