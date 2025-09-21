import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import AlbumCard from '@/components/AlbumCard';
import type { Album } from '@/types/library';

export function Albums({ albums }: { albums: Album[] }) {
	return (
		<div className="flex flex-col gap-4">
			<h2 className="text-xl font-bold">{albums.length} Albums</h2>
			<div className="grid gap-4 w-full grid-cols-[repeat(auto-fill,_minmax(12rem,_1fr))]">
				{albums.map((album) => (
					<AlbumCard key={album.id} album={album} />
				))}
			</div>
		</div>
	);
}
