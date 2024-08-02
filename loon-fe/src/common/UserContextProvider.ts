import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User } from "./types";

export type PlaybackDirection = "prev" | "next";

export interface EqBand {
  id: number;
  type: BiquadFilterType;
  frequency: number;
  gain: number;
}

export const DEFAULT_EQ_BANDS: EqBand[] = [
  {
    id: 0,
    type: "lowshelf",
    frequency: 100,
    gain: 0,
  },
  {
    id: 1,
    type: "peaking",
    frequency: 400,
    gain: 0,
  },
  {
    id: 2,
    type: "peaking",
    frequency: 1200,
    gain: 0,
  },
  {
    id: 3,
    type: "highshelf",
    frequency: 4000,
    gain: 0,
  },
];

export interface UserState {
  id?: number;
  selectedPlaylistId: string;
  selectedTrackId: string;
  selectedContextMenuId: string;
  shuffle: boolean;
  muted: boolean;
  volume: number;
  eqBands: EqBand[];
  theme?: string; // remove?
  transcode: boolean;
}

const DEFAULT_USER: UserState = {
  selectedPlaylistId: "",
  selectedTrackId: "",
  shuffle: false,
  muted: false,
  volume: 0,
  eqBands: DEFAULT_EQ_BANDS,
  transcode: false,
  selectedContextMenuId: "",
};

export const useUserStore = create<{ userState: UserState }>(
  persist(
    devtools(
      () => ({
        userState: DEFAULT_USER,
      }),
      { name: "userState" },
    ),
    { name: "loon-storage" },
  ),
);

export const useUserStore2 = create<{ user?: User }>(
  devtools(() => ({}), { name: "user" }),
);

const setUserState = (update: Partial<UserState>) =>
  useUserStore.setState((state) => ({
    ...state,
    userState: { ...state.userState, ...update },
  }));

// helpers

const updateUser = async (data) => {
  setUserState(data);
};

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

  updateUser({
    selectedPlaylistId: useUserStore.getState().userState.selectedPlaylistId,
    selectedTrackId,
  });
};

export const setMuted = async (muted: boolean) => updateUser({ muted });
export const setShuffle = async (shuffle: boolean) => updateUser({ shuffle });
export const setVolume = async (volume: number) => updateUser({ volume });
export const setTranscode = async (transcode: boolean) =>
  updateUser({ transcode });
export const setEqBands = async (eqBands: EqBand[]) => updateUser({ eqBands });

export const setSelectedContextMenuId = (selectedContextMenuId: string) =>
  updateUser({ selectedContextMenuId });
