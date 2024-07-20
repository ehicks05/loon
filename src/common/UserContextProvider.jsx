import _ from "lodash";
import create from "zustand";
import { devtools, persist } from "zustand/middleware";
import superFetch from "./SuperFetch";

export const useUserStore = create(
  persist(
    devtools(() => ({
      userState: {
        selectedPlaylistId: 0,
        selectedTrackId: "",
        volume: 0,
        eq1Frequency: 100,
        eq1Gain: 0,
        eq2Frequency: 400,
        eq2Gain: 0,
        eq3Frequency: 1200,
        eq3Gain: 0,
        eq4Frequency: 4000,
        eq4Gain: 0,
      },
      selectedContextMenuId: null,
    })),
    {
      name: "loon-storage",
    },
  ),
);

export const useUserStore2 = create(() => ({
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

const setUserState = (userState) => useUserStore.setState({ userState });

// helpers

const updateUser = async (data) => {
  const userId = useUserStore.getState().user?.id;
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
