import { Route, Routes } from 'react-router-dom';
import Playlist from '@/app/Playlist';
import { PlaylistBuilder } from '@/app/PlaylistBuilder';
import Playlists from '@/app/Playlists';

export default function Router() {
	return (
		<Routes>
			<Route path="/library" element={<Playlists />} />
			<Route path="/playlists/new" element={<PlaylistBuilder />} />
			<Route path="/playlists/:id" element={<Playlist />} />
			<Route path="/playlists/:id/edit" element={<PlaylistBuilder />} />
		</Routes>
	);
}
