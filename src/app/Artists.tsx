import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { FaSortAlphaDown, FaSortAmountDown } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import { ArtistCard } from '@/components/ArtistCard';
import { Button } from '@/components/Button';
import { useLibraryStore } from '@/hooks/useLibraryStore';

type ArtistSort = 'name' | 'tracks';

const SortButtons = ({
	orderBy,
	setOrderBy,
}: {
	orderBy: string;
	setOrderBy: Dispatch<SetStateAction<ArtistSort>>;
}) => (
	<div>
		<Button
			className={twMerge(
				'rounded-r-none text-neutral-400 bg-neutral-800',
				orderBy === 'tracks' ? 'text-green-400' : '',
			)}
			onClick={() => setOrderBy('tracks')}
		>
			<FaSortAmountDown />
		</Button>
		<Button
			className={twMerge(
				'rounded-l-none text-neutral-400 bg-neutral-800',
				orderBy === 'name' ? 'text-green-400' : '',
			)}
			onClick={() => setOrderBy('name')}
		>
			<FaSortAlphaDown />
		</Button>
	</div>
);

export default function Artists() {
	const [orderBy, setOrderBy] = useState<ArtistSort>('tracks');
	const artists = useLibraryStore((state) => state.artists).sort((o1, o2) =>
		orderBy === 'name'
			? o1.name.localeCompare(o2.name)
			: o2.tracks.length - o1.tracks.length,
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between">
				<h2 className="text-xl font-bold">{artists.length} Artists</h2>
				<SortButtons orderBy={orderBy} setOrderBy={setOrderBy} />
			</div>
			<div className="flex">
				<div className="grid gap-4 w-full grid-cols-[repeat(auto-fill,_minmax(12rem,_1fr))]">
					{artists.map((artist) => (
						<div key={artist.name} className="w-full">
							<ArtistCard artist={artist} size="thumb" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
