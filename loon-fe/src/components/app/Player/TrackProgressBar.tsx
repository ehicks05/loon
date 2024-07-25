import React from "react";
import { usePlayerStore } from "../../../common/PlayerContextProvider";
import { LoonSlider } from "../../Slider";
import { formatTime } from "../../utils";

export default function TrackProgressBar() {
  const { elapsedTime, duration, setForcedElapsedTime } = usePlayerStore(
    (state) => ({
      elapsedTime: state.elapsedTime,
      duration: state.duration,
      setForcedElapsedTime: state.setForcedElapsedTime,
    }),
  );

  const formattedElapsedTime = formatTime(elapsedTime);
  const formattedDuration = formatTime(duration);

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
