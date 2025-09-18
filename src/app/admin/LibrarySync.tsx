import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/Button';
import { orpc } from '@/orpc/client';

export const LibrarySync = () => {
	const {
		data: syncStatus,
		isLoading,
		refetch,
	} = useQuery({ ...orpc.system.syncStatus.queryOptions(), refetchInterval: 5000 });

	const { mutate: runLibrarySync, isPending } = useMutation({
		...orpc.system.triggerSync.mutationOptions(),
		onSuccess: () => refetch(),
	});

	const { mutate: deleteLibrary, isPending: isDeletingLibrary } = useMutation(
		orpc.system.clearLibrary.mutationOptions(),
	);

	const isDisableForm =
		isLoading || isPending || syncStatus?.isSyncing || isDeletingLibrary;

	return (
		<div className="flex gap-8 bg-black p-4 rounded">
			<div className="flex flex-col gap-2">
				<div className="font-bold text-lg">Sync</div>
				<Button
					className="bg-green-600"
					disabled={isDisableForm}
					onClick={() => runLibrarySync({})}
				>
					Sync Library
				</Button>
			</div>

			<div className="flex flex-col gap-4">
				<div className="font-bold text-lg">Cleanup</div>

				<Button
					className="bg-red-700"
					disabled={isDisableForm}
					onClick={() => alert('not implemented')}
				>
					Delete Tracks Without Files
				</Button>
				<Button
					className="bg-red-700"
					disabled={isDisableForm}
					onClick={() => {
						if (confirm('Delete Library?')) {
							deleteLibrary({});
						}
					}}
				>
					Delete Library
				</Button>
			</div>
		</div>
	);
};
