import create from "zustand";
import { devtools, persist } from "zustand/middleware";

export type PlaybackDirection = "prev" | "next";

export interface EqBand {
  id: number;
  frequency: number;
  gain: number;
  type: BiquadFilterType;
}

export const DEFAULT_EQ_BANDS: EqBand[] = [
  {
    id: 0,
    frequency: 100,
    gain: 0,
    type: "lowshelf",
  },
  {
    id: 1,
    frequency: 400,
    gain: 0,
    type: "peaking",
  },
  {
    id: 2,
    frequency: 1200,
    gain: 0,
    type: "peaking",
  },
  {
    id: 3,
    frequency: 4000,
    gain: 0,
    type: "highshelf",
  },
];

export type Loop = false | "playlist" | "track";

export interface UserState {
  eqBands: EqBand[];
  expandMediaColumn: boolean;
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
  expandMediaColumn: true,
  loop: "playlist",
  muted: false,
  selectedContextMenuId: "",
  selectedPlaylistId: "",
  selectedTrackId: "",
  shuffle: false,
  volume: 0,
};

export const useUserStore = create<UserState>(
  persist(
    devtools(() => DEFAULT_USER, { name: "userState" }),
    { name: "loon-storage" },
  ),
);

const updateUser = (update: Partial<UserState>) =>
  useUserStore.setState((state) => ({
    ...state,
    ...update,
  }));

export const setEqBands = async (eqBands: EqBand[]) => updateUser({ eqBands });

export const setExpandMediaColumn = async (expandMediaColumn: boolean) =>
  updateUser({ expandMediaColumn });

export const setLoop = async (loop: Loop) => updateUser({ loop });

export const setMuted = async (muted: boolean) => updateUser({ muted });

export const setSelectedContextMenuId = (selectedContextMenuId: string) =>
  updateUser({ selectedContextMenuId });

export const setSelectedPlaylistId = async (
  selectedPlaylistId: string,
  selectedTrackId: string,
) => {
  updateUser({
    selectedPlaylistId,
    selectedTrackId,
  });
};

export const setSelectedTrackId = async (selectedTrackId: string) => {
  if (!selectedTrackId) return;
  updateUser({ selectedTrackId });
};

export const setShuffle = async (shuffle: boolean) => updateUser({ shuffle });

export const setVolume = async (volume: number) => updateUser({ volume });
