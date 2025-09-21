import { ArrowDownAZ, ArrowDownWideNarrow } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from '@/components/ui/button';
import type { Artist } from '@/types/library';

export type ArtistSort = 'name' | 'tracks';

const SORT_BUTTONS = [
	{ value: 'tracks', Icon: ArrowDownWideNarrow },
	{ value: 'name', Icon: ArrowDownAZ },
] as const;

interface SortParams {
	artists: Artist[];
	orderBy: ArtistSort;
}

export const sort = ({ artists, orderBy }: SortParams) =>
	artists.sort((o1, o2) =>
		orderBy === 'name'
			? o1.name.localeCompare(o2.name)
			: o2.tracks.length - o1.tracks.length,
	);

interface SortButtonProps {
	orderBy: string;
	setOrderBy: Dispatch<SetStateAction<ArtistSort>>;
}

export const SortButtons = ({ orderBy, setOrderBy }: SortButtonProps) => (
	<div>
		{SORT_BUTTONS.map(({ value, Icon }) => (
			<Button
				key={value}
				variant="secondary"
				className={twMerge(
					'text-neutral-400',
					orderBy === value ? 'text-green-400' : '',
				)}
				onClick={() => setOrderBy(value)}
			>
				<Icon size={20} />
			</Button>
		))}
	</div>
);
