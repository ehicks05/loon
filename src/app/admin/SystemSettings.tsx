import { useEffect, useState } from 'react';
import { Button } from '@/components/Button';
import { CheckboxInput, TextInput } from '@/components/TextInput';
import type { SystemSettings as ISystemSettings } from '@/types/trpc';
import { trpc } from '@/utils/trpc';
import { LibrarySync } from './LibrarySync';
import { MusicFolderSummary } from './MusicFolderSummary';

export default function SystemSettings() {
	const { data, isFetching } = trpc.misc.systemSettings.useQuery();
	const { mutate, isPending } = trpc.misc.setSystemSettings.useMutation();
	const isLoading = isFetching || isPending;

	// local, mutable cache
	const [settings, setSettings] = useState<ISystemSettings | undefined>(undefined);

	useEffect(() => {
		if (data) {
			setSettings(data);
		}
	}, [data]);

	if (!settings) {
		return <div>Loading...</div>;
	}

	const onChange = (name: string, value: string | boolean) => {
		setSettings({ ...settings, [name]: value });
	};

	return (
		<div className="flex flex-col gap-4">
			<section>
				<h1 className="font-bold text-2xl">Admin</h1>
				<h2>Modify System</h2>
			</section>
			<section className="flex gap-4 items-start">
				<div className="flex flex-col gap-4 p-4 bg-black rounded">
					<div className={'flex flex-col gap-2'}>
						<div className="font-bold text-lg">General</div>
						<TextInput
							name="musicFolder"
							label="Music Folder"
							value={settings.musicFolder}
							onChange={(e) => onChange(e.target.name, e.target.value)}
						/>
						<MusicFolderSummary />
					</div>
					<div className={'flex flex-col gap-2'}>
						<div className="font-bold text-lg">Library Sync Settings</div>
						<CheckboxInput
							label="Sync DB"
							name="syncDb"
							checked={settings.syncDb}
							onChange={(e) => onChange(e.target.name, e.target.checked)}
						/>
						<CheckboxInput
							label="Sync Images"
							name="syncImages"
							checked={settings.syncImages}
							onChange={(e) => onChange(e.target.name, e.target.checked)}
						/>
					</div>
					<Button
						className={'bg-green-600'}
						onClick={() => mutate(settings)}
						disabled={isLoading}
					>
						Save
					</Button>
				</div>

				<LibrarySync />
			</section>
		</div>
	);
}
