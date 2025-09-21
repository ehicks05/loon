import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { CheckboxInput, TextInput } from '@/components/TextInput';
import { Button } from '@/components/ui/button';
import { orpc } from '@/orpc/client';
import type { SystemSettings as ISystemSettings } from '@/orpc/types';
import { MusicFolderSummary } from './MusicFolderSummary';

export default function SystemSettings() {
	const {
		data: system,
		isFetching: isFetchingSystem,
		refetch,
	} = useQuery(orpc.system.get.queryOptions());

	const { data: isSyncing } = useQuery(
		orpc.system.isSyncing.experimental_liveOptions(),
	);

	const { mutate, isPending: isPendingSave } = useMutation(
		orpc.system.update.mutationOptions(),
	);

	// local, mutable cache
	const [settings, setSettings] = useState<ISystemSettings | undefined>(system);

	useEffect(() => {
		if (system) {
			setSettings(system);
		}
	}, [system]);

	const onChange = (name: string, value: string | boolean) => {
		if (settings) {
			setSettings({ ...settings, [name]: value });
		}
	};

	const { mutate: syncLibrary, isPending: isPendingTriggerSync } = useMutation({
		...orpc.system.triggerSync.mutationOptions(),
		onSuccess: () => refetch(),
	});

	const { mutate: deleteLibrary, isPending: isDeletingLibrary } = useMutation(
		orpc.system.clearLibrary.mutationOptions(),
	);

	if (!system || !settings) {
		return <div>Loading...</div>;
	}

	const isLoading =
		isFetchingSystem ||
		isPendingSave ||
		isPendingTriggerSync ||
		isSyncing ||
		isDeletingLibrary;

	return (
		<>
			<div className="flex gap-4">
				<div className={'flex flex-col gap-2 w-full'}>
					<TextInput
						name="musicFolder"
						label="Music Folder"
						className="w-full"
						value={settings.musicFolder}
						onChange={(e) => onChange(e.target.name, e.target.value)}
					/>
					<MusicFolderSummary />
					<CheckboxInput
						label="Sync Images"
						name="syncImages"
						checked={settings.syncImages}
						onChange={(e) => onChange(e.target.name, e.target.checked)}
					/>
				</div>
			</div>

			<div className="flex gap-2">
				<Button
					variant="default"
					onClick={() => mutate(settings)}
					disabled={isLoading}
				>
					Save
				</Button>
				<Button
					variant="default"
					disabled={isLoading}
					onClick={() => syncLibrary({})}
				>
					Sync Now
				</Button>
				<Button
					variant="destructive"
					disabled={isLoading}
					onClick={() => {
						if (confirm('Delete Library?')) {
							deleteLibrary({});
						}
					}}
				>
					Delete Library
				</Button>
			</div>
		</>
	);
}
