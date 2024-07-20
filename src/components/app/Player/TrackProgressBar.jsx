import Slider from "rc-slider/es";
import React from "react";
import { usePlayerStore } from "../../../common/PlayerContextProvider";
import "rc-slider/assets/index.css";

function formatTime(secs) {
  const minutes = Math.floor(secs / 60) || 0;
  const seconds = Math.round(secs - minutes * 60) || 0;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default function TrackProgressBar() {
  const { elapsedTime, duration, setForcedElapsedTime } = usePlayerStore(
    (state) => ({
      elapsedTime: state.elapsedTime,
      duration: state.duration,
      setForcedElapsedTime: state.setForcedElapsedTime,
    }),
  );

  const formattedElapsedTime = formatTime(Math.round(elapsedTime));
  const formattedDuration = formatTime(Math.round(duration));

  function HandleSetElapsedTime(value) {
    setForcedElapsedTime(value);
  }

  return (
    <div className="flex gap-3 items-center">
      <span id="timeElapsed" className="text-sm">
        {formattedElapsedTime}
      </span>
      <Slider
        name="progress"
        id="progress"
        style={{ width: "100%", margin: "0", cursor: "pointer" }}
        trackStyle={{ backgroundColor: "hsl(141, 71%, 48%)", height: 4 }}
        railStyle={{ backgroundColor: "#aaa" }}
        handleStyle={{
          borderColor: "hsl(141, 11%, 88%)",
          backgroundColor: "hsl(141, 11%, 88%)",
          scale: ".8",
        }}
        type="range"
        value={elapsedTime}
        max={duration}
        step={0.01}
        onChange={HandleSetElapsedTime}
      />
      <span id="duration" className="text-sm">
        {formattedDuration}
      </span>
    </div>
  );
}
