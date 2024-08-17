import { API_URL } from "../apiUrl";

export const authedFetch = (url: string, options?: RequestInit) =>
  fetch(API_URL + url, { ...options, credentials: "include" });
