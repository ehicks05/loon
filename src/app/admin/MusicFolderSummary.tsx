import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { orpc } from '@/orpc/client';

export const MusicFolderSummary = () => {
	const [enabled, setEnabled] = useState(false);

	const { data, isFetching, refetch } = useQuery({
		...orpc.system.listFiles.queryOptions(),
		enabled,
	});
	const fileCount = data?.mediaFiles.length;

	const handleClick = () => {
		if (!enabled) {
			setEnabled(true);
		} else {
			refetch();
		}
	};

	return (
		<div className="flex gap-2 items-center">
			<Button disabled={isFetching} className="text-sm" onClick={handleClick}>
				Check
			</Button>

			{data && (
				<span className="text-sm">
					Found{' '}
					{isFetching ? (
						'?'
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
