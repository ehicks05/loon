import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/Button';
import { orpc } from '@/orpc/client';

export const MusicFolderSummary = () => {
	const { data, isFetching, refetch } = useQuery({
		...orpc.system.listFiles.queryOptions(),
		enabled: false,
	});
	const fileCount = data?.mediaFiles.length;

	const handleClick = () => {
		refetch();
	};

	return (
		<div className="flex gap-2 items-center">
			<Button disabled={isFetching} onClick={handleClick}>
				Check Music Folder
			</Button>

			{data && (
				<span className="text-sm">
					Found{' '}
					{isFetching ? (
						'...'
					) : (
						<span
							className={`font-bold ${fileCount ? 'text-green-500' : 'text-red-500'}`}
						>
							{fileCount && Intl.NumberFormat().format(fileCount)}
						</span>
					)}{' '}
					media files
				</span>
			)}
		</div>
	);
};
