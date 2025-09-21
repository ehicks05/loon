import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Volume2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { usePlaylists } from '@/hooks/usePlaylists';
import { useUser } from '@/hooks/useUser';
import { authClient } from '@/lib/auth-client';
import { orpc } from '@/orpc/client';

export function Playlists() {
	const { data: session } = authClient.useSession();
	const user = session?.user;

	const { data } = usePlaylists();
	const playlists = data?.playlists || [];

	const { selectedPlaylistId } = useUser();
	const queryClient = useQueryClient();

	const { mutate: deletePlaylist } = useMutation({
		...orpc.playlist.remove.mutationOptions(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: orpc.playlist.list.queryKey() });
		},
	});

	if (!user) {
		return <section>Please log in to access your library.</section>;
	}

	return (
		<div>
			<section>
				<h1 className="font-bold text-2xl">Library</h1>
			</section>

			<section className="flex flex-col gap-2 items-start">
				{playlists.map((playlist, index) => {
					const handleClickDelete = () => {
						window.confirm('Delete this playlist?')
							? deletePlaylist(playlist.id)
							: undefined;
					};

					return (
						<div className="flex gap-4 w-full items-center" key={playlist.id}>
							<div> {index + 1}. </div>
							<Link
								to="/playlists/$id"
								params={{ id: playlist.id }}
								className="flex-grow font-bold flex items-center"
							>
								{playlist.name}

								{playlist.id === selectedPlaylistId && (
									<span className="w-4 h-4 text-green-500 ml-3">
										<Volume2 aria-hidden="true" size={20} />
									</span>
								)}
							</Link>
							<div>{playlist.playlistTracks.length} tracks</div>
							<div className="flex gap-2">
								<Button>
									<Link to="/playlists/$id/edit" params={{ id: playlist.id }}>
										Edit
									</Link>
								</Button>

								<Button
									disabled={playlist.queue || playlist.favorites}
									className="bg-red-600"
									onClick={handleClickDelete}
								>
									Delete
								</Button>
							</div>
						</div>
					);
				})}
				<Button className="bg-green-600">
					<Link to="/playlists/new">New Playlist</Link>
				</Button>
			</section>
		</div>
	);
}
