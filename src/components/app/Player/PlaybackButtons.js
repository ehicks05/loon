import React from "react";
import { setSelectedTrackId } from "../../../common/UserContextProvider";
import { usePlayerStore } from "../../../common/PlayerContextProvider";

import { useWindowSize } from "react-use";
import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import { getNewTrackId } from "./trackDeterminationUtils";

export default function PlaybackButtons() {
  const playbackState = usePlayerStore((state) => state.playbackState);
  const setPlaybackState = usePlayerStore((state) => state.setPlaybackState);
  const { width } = useWindowSize();

  function handleTrackChange(direction) {
    setSelectedTrackId(getNewTrackId(direction));
  }

  return (
    <>
      <button
        className="button"
        style={{ height: "36px", width: "36px" }}
        onClick={() => handleTrackChange("prev")}
      >
        <span className="icon">
          <FaStepBackward />
        </span>
      </button>
      <button
        className="button is-medium"
        style={{ height: "45px", width: "45px" }}
        onClick={() =>
          setPlaybackState(playbackState === "playing" ? "paused" : "playing")
        }
      >
        <span className="icon">
          {playbackState === "playing" ? <FaPause /> : <FaPlay />}
        </span>
      </button>
      <button
        className="button"
        style={{ height: "36px", width: "36px" }}
        onClick={() => handleTrackChange("next")}
      >
        <span className="icon">
          <FaStepForward />
        </span>
      </button>
      {width >= 768 && <span style={{ paddingLeft: "8px" }}> </span>}
    </>
  );
}
