import apiUrl from "../apiUrl";

function superFetch(url: string, options?: RequestInit) {
  return fetch(apiUrl + url, { ...options, credentials: "include" });
}

export default superFetch;
