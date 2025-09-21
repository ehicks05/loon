import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import { useState } from 'react';
import { ArtistCard } from '@/components/ArtistCard';
import type { Artist } from '@/types/library';
import { type ArtistSort, SortButtons, sort } from './-SortButtons';

export function Artists({ artists }: { artists: Artist[] }) {
	const [orderBy, setOrderBy] = useState<ArtistSort>('tracks');

	return (
		<div className="flex flex-col gap-4">
			<div className="flex justify-between">
				<h2 className="text-xl font-bold">{artists.length} Artists</h2>
				<SortButtons orderBy={orderBy} setOrderBy={setOrderBy} />
			</div>
			<div className="flex">
				<div className="grid gap-4 w-full grid-cols-[repeat(auto-fill,_minmax(12rem,_1fr))]">
					{sort({ artists, orderBy }).map((artist) => (
						<div key={artist.name} className="w-full">
							<ArtistCard artist={artist} size="thumb" />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
