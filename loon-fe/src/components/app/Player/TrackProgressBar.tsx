import React from "react";
import { usePlayerStore } from "../../../common/PlayerContextProvider";
import { LoonSlider } from "../../Slider";

function formatTime(secs: number) {
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

  return (
    <div className="flex gap-3 items-center">
      <span id="timeElapsed" className="text-sm">
        {formattedElapsedTime}
      </span>
      <LoonSlider
        value={[elapsedTime]}
        onValueChange={(value) => setForcedElapsedTime(value[0])}
        min={0}
        max={duration}
        step={1}
      />
      <span id="duration" className="text-sm">
        {formattedDuration}
      </span>
    </div>
  );
}
