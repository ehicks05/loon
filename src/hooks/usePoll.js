import { useEffect } from "react";
import superFetch from "../common/SuperFetch";
export default function usePoll(url, delay) {
  useEffect(() => {
    const doFetch = () => {
      superFetch(url)
        .then((response) => response.text())
        .then((text) => console.log("poll result: " + text));
    };
    doFetch();
    const pollIntervalId = setInterval(doFetch, delay);

    return function cleanup() {
      clearInterval(pollIntervalId);
    };
  }, [url, delay]);
}
