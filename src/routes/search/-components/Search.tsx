import { SearchIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { TextInput } from '@/components/TextInput';
import { useUser } from '@/hooks/useUser';
import type { Track } from '@/types/library';
import { TrackListing } from './TrackListing';

const toSearchFields = (track: Track) =>
	[track.title, track.album.name, ...track.artists.map((artist) => artist.name)].map(
		(o) => o.toLocaleLowerCase(),
	);

export default function Search({ tracks }: { tracks: Track[] }) {
	const [searchKey, setSearchKey] = useState('');
	const [debouncedSearchKey, setDebouncedSearchKey] = useDebounceValue(
		searchKey,
		300,
	);
	const [searchResults, setSearchResults] = useState<Track[]>([]);

	const { setSelectedContextMenuId } = useUser();

	useEffect(() => {
		return function cleanup() {
			setSelectedContextMenuId('');
		};
	}, []);

	useEffect(() => {
		const key = debouncedSearchKey.toLowerCase();
		const filteredTracks =
			key.length > 0
				? tracks.filter((track) =>
						toSearchFields(track).some((searchField) => searchField.includes(key)),
					)
				: tracks;

		setSearchResults(filteredTracks);
	}, [tracks, debouncedSearchKey]);

	return (
		<div className="flex h-full flex-col overflow-hidden">
			<TextInput
				leftIcon={<SearchIcon color="gray" size={20} />}
				value={searchKey}
				onChange={(e) => {
					setSearchKey(e.target.value);
					setDebouncedSearchKey(e.target.value);
				}}
				isHorizontal={false}
				autoComplete="off"
			/>

			<TrackListing tracks={searchResults} />
		</div>
	);
}
