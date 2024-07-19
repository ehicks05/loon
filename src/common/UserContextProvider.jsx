import _ from "lodash";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import superFetch from "./SuperFetch";

export const useUserStore = create(
  persist(
    devtools(() => ({
      user: null,
      userState: null,
      selectedContextMenuId: null,
    })),
    {
      name: "loon-storage",
    },
  ),
);

export const setUser = (user) => useUserStore.setState({ user });
export const fetchUser = async () => {
  try {
    const response = await superFetch("/me");
    useUserStore.setState({ user: await response.json() });
  } catch (err) {
    console.log("unable to load user");
  }
};

const setUserState = (userState) => useUserStore.setState({ userState });

// helpers

const updateUser = async (data) => {
  const userId = useUserStore.getState().user.id;
  setUserState({ ...useUserStore.getState().userState, ...data });
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

export const setSelectedContextMenuId = (selectedContextMenuId) =>
  useUserStore.setState({ selectedContextMenuId });
