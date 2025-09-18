import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { CheckboxInput, TextInput } from '@/components/TextInput';
import { orpc } from '@/orpc/client';
import type { SystemSettings as ISystemSettings } from '@/orpc/types';
import { MusicFolderSummary } from './MusicFolderSummary';
import UserSettings from './UserSettings';

export default function SystemSettings() {
	const {
		data: system,
		isFetching: isFetchingSystem,
		refetch,
	} = useQuery({
		...orpc.system.get.queryOptions(),
		refetchInterval: 5000,
	});
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
		system?.isSyncing ||
		isDeletingLibrary;

	return (
		<div className="flex flex-col gap-4">
			<section>
				<h1 className="font-bold text-2xl">System Settings</h1>
			</section>
			<div className="flex flex-wrap gap-4">
				<section className="flex flex-wrap gap-4">
					<div className="flex flex-col gap-4 p-4 bg-black rounded">
						<div className="flex gap-4">
							<div className={'flex flex-col gap-2 w-full'}>
								<div className="font-bold text-lg">General</div>
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
								className={'bg-green-600'}
								onClick={() => mutate(settings)}
								disabled={isLoading}
							>
								Save
							</Button>
							<Button
								className="bg-green-600"
								disabled={isLoading}
								onClick={() => syncLibrary({})}
							>
								Sync Now
							</Button>
							<Button
								className="bg-red-700"
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
					</div>
				</section>

				<section>
					<div className="flex flex-col gap-4 p-4 bg-black rounded">
						<div className="font-bold text-lg">Users</div>

						<UserSettings />
					</div>
				</section>
			</div>
		</div>
	);
}
