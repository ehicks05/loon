import { useLocalStorage } from 'usehooks-ts';

export type PlaybackDirection = 'prev' | 'next';

export interface EqBand {
	id: number;
	frequency: number;
	gain: number;
	type: BiquadFilterType;
}

export const DEFAULT_EQ_BANDS: EqBand[] = [
	{ id: 0, frequency: 100, gain: 0, type: 'lowshelf' },
	{ id: 1, frequency: 400, gain: 0, type: 'peaking' },
	{ id: 2, frequency: 1200, gain: 0, type: 'peaking' },
	{ id: 3, frequency: 4000, gain: 0, type: 'highshelf' },
];

export type Loop = false | 'playlist' | 'track';

export interface UserState {
	eqBands: EqBand[];
	loop: Loop;
	muted: boolean;
	selectedContextMenuId: string;
	selectedPlaylistId: string;
	selectedTrackId: string;
	shuffle: boolean;
	volume: number;
}

const DEFAULT_USER: UserState = {
	eqBands: DEFAULT_EQ_BANDS,
	loop: 'playlist',
	muted: false,
	selectedContextMenuId: '',
	selectedPlaylistId: '',
	selectedTrackId: '',
	shuffle: false,
	volume: 0,
};

export const useUser = () => {
	const [user, setUser] = useLocalStorage('user', DEFAULT_USER);

	const updateUser = (update: Partial<UserState>) =>
		setUser((user) => ({
			...user,
			...update,
		}));

	const setEqBands = async (eqBands: EqBand[]) => updateUser({ eqBands });

	const setLoop = async (loop: Loop) => updateUser({ loop });

	const setMuted = async (muted: boolean) => updateUser({ muted });

	const setSelectedContextMenuId = (selectedContextMenuId: string) =>
		updateUser({ selectedContextMenuId });

	const setSelectedPlaylistId = async (
		selectedPlaylistId: string,
		selectedTrackId: string,
	) => {
		updateUser({
			selectedPlaylistId,
			selectedTrackId,
		});
	};

	const setSelectedTrackId = async (selectedTrackId: string) => {
		if (!selectedTrackId) return;
		updateUser({ selectedTrackId });
	};

	const setShuffle = async (shuffle: boolean) => updateUser({ shuffle });

	const setVolume = async (volume: number) => updateUser({ volume });

	return {
		user,
		updateUser,

		eqBands: user.eqBands,
		setEqBands,

		loop: user.loop,
		setLoop,

		muted: user.muted,
		setMuted,

		selectedContextMenuId: user.selectedContextMenuId,
		setSelectedContextMenuId,

		selectedPlaylistId: user.selectedPlaylistId,
		setSelectedPlaylistId,

		selectedTrackId: user.selectedTrackId,
		setSelectedTrackId,

		shuffle: user.shuffle,
		setShuffle,

		volume: user.volume,
		setVolume,
	};
};
