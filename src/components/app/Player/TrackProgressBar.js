import React from "react";
import { usePlayerStore } from "../../../common/PlayerContextProvider";
import Slider from "rc-slider/es";
import "rc-slider/assets/index.css";

export default function TrackProgressBar() {
  const { elapsedTime, duration, setForcedElapsedTime } = usePlayerStore(
    (state) => ({
      elapsedTime: state.elapsedTime,
      duration: state.duration,
      setForcedElapsedTime: state.setForcedElapsedTime,
    })
  );

  const formattedElapsedTime = formatTime(Math.round(elapsedTime));
  const formattedDuration = formatTime(Math.round(duration));

  function formatTime(secs) {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = Math.round(secs - minutes * 60) || 0;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  function HandleSetElapsedTime(value) {
    setForcedElapsedTime(value);
  }

  return (
    <div className="level-item" style={{ marginBottom: "0" }}>
      <span
        id="timeElapsed"
        style={{ fontSize: ".875rem", marginRight: "10px" }}
      >
        {formattedElapsedTime}
      </span>
      <Slider
        name="progress"
        id="progress"
        style={{ width: "100%", margin: "0", cursor: "pointer" }}
        trackStyle={{ backgroundColor: "hsl(141, 71%, 48%)", height: 4 }}
        railStyle={{ backgroundColor: "#ddd" }}
        handleStyle={{ borderColor: "hsl(141, 71%, 48%)" }}
        type="range"
        value={elapsedTime}
        max={duration}
        step={0.01}
        onChange={HandleSetElapsedTime}
      />
      <span id="duration" style={{ fontSize: ".875rem", marginLeft: "8px" }}>
        {formattedDuration}
      </span>
    </div>
  );
}
