import { useState } from 'react';
import CheckboxTree, { type Node } from 'react-checkbox-tree';
import { Button } from '@/components/Button';
import { TextInput } from '@/components/TextInput';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { orpc } from '@/orpc/client';
import type { Playlist } from '@/orpc/types';
import type { Track } from '@/types/library';
import { tracksToNodes } from './helpers';
import { icons } from './icons';

interface FormProps {
	playlist?: Playlist;
	nodes: Node[];
	defaultChecked: string[];
	defaultExpanded: string[];
}

function PlaylistBuilderForm({
	playlist,
	nodes,
	defaultChecked,
	defaultExpanded,
}: FormProps) {
	const navigate = useNavigate();
	const [name, setName] = useState(playlist?.name || 'New Playlist');
	const [checked, setChecked] = useState<string[]>(defaultChecked);
	const [expanded, setExpanded] = useState<string[]>(defaultExpanded);

	const queryClient = useQueryClient();

	const { mutate: insertPlaylist, isPending: isInsertPending } = useMutation({
		...orpc.playlist.insert.mutationOptions(),
		onSuccess: ({ id }) => {
			queryClient.invalidateQueries({ queryKey: [orpc.playlist.list.queryKey] });
			navigate({ to: '/playlists/$id', params: { id } });
		},
	});

	const { mutate: updatePlaylist, isPending: isUpdatePending } = useMutation({
		...orpc.playlist.update.mutationOptions(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [orpc.playlist.list.queryKey] });
		},
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
				<div className="">Tracks ({checked.length} selected)</div>
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

interface Props {
	playlist?: Playlist;
	tracks: Track[];
}

export function PlaylistBuilder({ playlist, tracks }: Props) {
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
