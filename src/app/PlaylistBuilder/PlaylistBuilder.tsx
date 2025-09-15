import { useState } from 'react';
import CheckboxTree, { type Node } from 'react-checkbox-tree';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import type { Playlist } from '@/types/trpc';
import { trpc } from '@/utils/trpc';
import { tracksToNodes } from './helpers';
import { icons } from './icons';

function PlaylistBuilderForm({
	playlist,
	nodes,
	defaultChecked,
	defaultExpanded,
}: {
	playlist?: Playlist;
	nodes: Node[];
	defaultChecked: string[];
	defaultExpanded: string[];
}) {
	const navigate = useNavigate();
	const utils = trpc.useUtils();
	const [name, setName] = useState(playlist?.name || 'New Playlist');
	const [checked, setChecked] = useState<string[]>(defaultChecked);
	const [expanded, setExpanded] = useState<string[]>(defaultExpanded);

	const { mutate: insertPlaylist, isPending: isInsertPending } =
		trpc.playlist.insert.useMutation({
			onSuccess: ({ id }) => {
				utils.playlist.list.invalidate();
				navigate(`/playlists/${id}`);
			},
		});
	const { mutate: updatePlaylist, isPending: isUpdatePending } =
		trpc.playlist.update.useMutation({
			onSuccess: () => utils.playlist.list.invalidate(),
		});
	const isPending = isInsertPending || isUpdatePending;

	const onClick = () =>
		playlist
			? updatePlaylist({ id: playlist.id, name, trackIds: checked })
			: insertPlaylist({ name, trackIds: checked });

	return (
		<section className="flex flex-col justify-between h-full gap-4">
			<h1 className="text-2xl font-bold">Playlist Builder</h1>
			<TextInput
				name="name"
				label="Name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				disabled={playlist?.favorites || playlist?.queue}
			/>

			<div className="flex flex-col h-full overflow-auto">
				<label className="">Tracks ({checked.length} selected)</label>
				<CheckboxTree
					nodes={nodes}
					checked={checked}
					expanded={expanded}
					onCheck={(checked) => setChecked(checked)}
					onExpand={(expanded) => setExpanded(expanded)}
					icons={icons}
				/>
			</div>

			<Button disabled={isPending} className={'bg-green-600'} onClick={onClick}>
				{playlist ? 'Update' : 'Create'} Playlist
			</Button>
		</section>
	);
}

export function PlaylistBuilder() {
	const { id } = useParams();

	const { data: { tracks } = {} } = trpc.library.list.useQuery();
	const { data: playlist, isLoading: isLoadingPlaylist } =
		trpc.playlist.getById.useQuery(id || '', {
			enabled: !!id,
		});

	if (!tracks || isLoadingPlaylist) {
		return <div>Loading...</div>;
	}

	const { nodes, expandedIds } = tracksToNodes(tracks);
	const defaultChecked =
		playlist?.playlistTracks.map(({ trackId }) => trackId) || [];

	return (
		<PlaylistBuilderForm
			playlist={playlist}
			nodes={nodes}
			defaultChecked={defaultChecked}
			defaultExpanded={expandedIds}
		/>
	);
}
