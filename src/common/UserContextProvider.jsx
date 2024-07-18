import create from "zustand";
import { devtools } from "zustand/middleware";
import _ from "lodash";
import superFetch from "./SuperFetch";

const baseUrl = "/users/";

export const useUserStore = create(
  devtools(() => ({
    user: null,
    userState: null,
    selectedContextMenuId: null,
  }))
);

export const setUser = (user) => useUserStore.setState({ user });
export const fetchUser = async () => {
  try {
    const response = await superFetch("/me");
    useUserStore.setState({ user: await response.json() });
    await fetchUserState();
  } catch (err) {
    console.log("unable to load user");
  }
};

export const setUserState = (userState) => useUserStore.setState({ userState });
export const fetchUserState = async () => {
  try {
    const response = await superFetch(baseUrl + "currentUserState");
    useUserStore.setState({ userState: await response.json() });
  } catch (err) {
    console.log("unable to load userState");
  }
};

// helpers

const toFormData = (input) => {
  const formData = new FormData();
  Object.entries(input).forEach(([key, val]) => formData.append(key, val));
  return formData;
};

const debouncedVolumeFetch = _.debounce(superFetch, 2000);

export const updateUser = async (url, data) => {
  Object.entries(data).forEach(([key, val]) =>
    setUserState({ ...useUserStore.getState().userState, [key]: val })
  );

  if (data.volume) {
    await debouncedVolumeFetch(baseUrl + url, {
      method: "PUT",
      body: toFormData(data),
    });
  } else
    await superFetch(baseUrl + url, { method: "PUT", body: toFormData(data) });

  // fetchUserState();
};

export const setSelectedPlaylistId = async (
  selectedPlaylistId,
  selectedTrackId
) => {
  updateUser(useUserStore.getState().user.id + "/saveProgress", {
    selectedPlaylistId,
    selectedTrackId,
  });
};
export const setSelectedTrackId = async (selectedTrackId) => {
  updateUser(useUserStore.getState().user.id + "/saveProgress", {
    selectedPlaylistId: useUserStore.getState().userState.selectedPlaylistId,
    selectedTrackId,
  });
};

export const setMuted = async (muted) => {
  updateUser(useUserStore.getState().user.id, { muted });
};
export const setShuffle = async (shuffle) => {
  updateUser(useUserStore.getState().user.id, { shuffle });
};
export const setVolume = async (volume) => {
  updateUser(useUserStore.getState().user.id, { volume });
};
export const setTranscode = async (transcode) => {
  updateUser(useUserStore.getState().user.id, { transcode });
};

const debouncedEqFetch = _.debounce(superFetch, 2000);

export const setEq = async (eqNum, field, value) => {
  const stateField = `eq${eqNum}${field}`;
  setUserState({ ...useUserStore.getState().userState, [stateField]: value });

  await debouncedEqFetch(baseUrl + useUserStore.getState().user.id, {
    method: "PUT",
    body: toFormData({ eqNum, eqField: field, eqValue: value }),
  });
};

export const setSelectedContextMenuId = (selectedContextMenuId) =>
  useUserStore.setState({ selectedContextMenuId });
