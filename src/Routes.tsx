import { Navigate, Route, Routes } from 'react-router-dom';
import About from '@/app/About';
import Album from '@/app/Album';
import Albums from '@/app/Albums';
import Artist from '@/app/Artist';
import Artists from '@/app/Artists';
import SystemSettings from '@/app/admin/SystemSettings';
import UserSettings from '@/app/admin/UserSettings';
import { GithubLogin } from '@/app/GithubLogin';
import Playlist from '@/app/Playlist';
import { PlaylistBuilder } from '@/app/PlaylistBuilder';
import Playlists from '@/app/Playlists';
import Search from '@/app/Search';
import Eq from '@/app/settings/EqPage';
import GeneralSettings from '@/app/settings/GeneralSettings';
import { Login } from './app/Login';
import { trpc } from './utils/trpc';

export default function Router() {
	const { data: user } = trpc.misc.me.useQuery();
	const isAdmin = user?.isAdmin;

	return (
		<Routes>
			<Route
				path="/admin/systemSettings"
				element={isAdmin ? <SystemSettings /> : <Navigate to="/" />}
			/>
			<Route
				path="/admin/users"
				element={isAdmin ? <UserSettings /> : <Navigate to="/" />}
			/>
			<Route
				path="/admin/about"
				element={isAdmin ? <About /> : <Navigate to="/" />}
			/>

			<Route path="/" element={<Navigate to="/search" />} />
			<Route path="/login/github" element={<GithubLogin />} />
			<Route path="/login" element={<Login />} />
			<Route path="/settings/general" element={<GeneralSettings />} />
			<Route path="/settings/eq" element={<Eq />} />
			<Route path="/artists" element={<Artists />} />
			<Route path="/artists/:id" element={<Artist />} />
			<Route path="/albums" element={<Albums />} />
			<Route path="/albums/:id" element={<Album />} />
			<Route path="/search" element={<Search />} />
			<Route path="/library" element={<Playlists />} />
			<Route path="/playlists/new" element={<PlaylistBuilder />} />
			<Route path="/playlists/:id" element={<Playlist />} />
			<Route path="/playlists/:id/edit" element={<PlaylistBuilder />} />
		</Routes>
	);
}
