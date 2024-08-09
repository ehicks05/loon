import { API_URL } from "../apiUrl";

function superFetch(url: string, options?: RequestInit) {
  return fetch(API_URL + url, { ...options, credentials: "include" });
}

export default superFetch;
