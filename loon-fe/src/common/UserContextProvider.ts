import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User } from "./types";

export interface UserState {
  id?: number;
  selectedPlaylistId: number;
  selectedTrackId: string;
  selectedContextMenuId: string;
  shuffle: boolean;
  muted: boolean;
  volume: number;
  eq1Frequency: number;
  eq1Gain: number;
  eq2Frequency: number;
  eq2Gain: number;
  eq3Frequency: number;
  eq3Gain: number;
  eq4Frequency: number;
  eq4Gain: number;
  theme?: string; // remove?
  transcode: boolean;
}

const DEFAULT_USER: UserState = {
  selectedPlaylistId: 0,
  selectedTrackId: "",
  shuffle: false,
  muted: false,
  volume: 0,
  eq1Frequency: 100,
  eq1Gain: 0,
  eq2Frequency: 400,
  eq2Gain: 0,
  eq3Frequency: 1200,
  eq3Gain: 0,
  eq4Frequency: 4000,
  eq4Gain: 0,
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
  const userId = useUserStore2.getState().user?.id;
  setUserState(data);
};

export const setSelectedPlaylistId = async (
  selectedPlaylistId,
  selectedTrackId,
) => {
  updateUser({
    selectedPlaylistId,
    selectedTrackId,
  });
};

export const setSelectedTrackId = async (selectedTrackId) => {
  if (!selectedTrackId) return;

  updateUser({
    selectedPlaylistId: useUserStore.getState().userState.selectedPlaylistId,
    selectedTrackId,
  });
};

export const setMuted = async (muted) => {
  updateUser({ muted });
};
export const setShuffle = async (shuffle) => {
  updateUser({ shuffle });
};
export const setVolume = async (volume) => {
  updateUser({ volume });
};
export const setTranscode = async (transcode) => {
  updateUser({ transcode });
};

export const setEq = async (eqNum, field, value) => {
  const stateField = `eq${eqNum}${field}`;
  updateUser({ [stateField]: value });
};

export const setSelectedContextMenuId = (selectedContextMenuId: string) =>
  updateUser({ selectedContextMenuId });
