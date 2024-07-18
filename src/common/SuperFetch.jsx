import apiUrl from "../apiUrl";

function superFetch(url, options) {
  return fetch(apiUrl + url, { ...options, credentials: "include" });
}

export default superFetch;
