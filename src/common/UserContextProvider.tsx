import _ from "lodash";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import superFetch from "./SuperFetch";

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

interface Role {
  id?: null;
  role: "ROLE_USER" | "ROLE_ADMIN";
  authority: "ROLE_USER" | "ROLE_ADMIN";
  new: boolean;
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  roles: Role[];
  userState: UserState;
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  admin: boolean;
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
    devtools(() => ({
      userState: DEFAULT_USER,
    })),
    { name: "loon-storage" },
  ),
);

export const useUserStore2 = create<{ user: User | null }>(() => ({
  user: null,
}));

const setUser = (user) => useUserStore2.setState({ user });
export const fetchUser = async () => {
  try {
    const response = await superFetch("/me");
    setUser({ user: await response.json() });
  } catch (err) {
    console.log("unable to load user");
  }
};

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
