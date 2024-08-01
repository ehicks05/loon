import { useEffect, useState } from "react";
import { usePlayerStore } from "../../common/PlayerContextProvider";
import { LoonSlider } from "../Slider";
import { formatTime } from "../utils";

export default function TrackProgressBar() {
  const { elapsedTime, duration, setForcedElapsedTime } = usePlayerStore(
    (state) => ({
      elapsedTime: state.elapsedTime,
      duration: state.duration,
      setForcedElapsedTime: state.setForcedElapsedTime,
    }),
  );

  const [localValue, setLocalValue] = useState(elapsedTime);
  const [isPointerDown, setIsPointerDown] = useState(false);

  useEffect(() => {
    if (!isPointerDown) {
      setLocalValue(elapsedTime);
    }
  }, [isPointerDown, elapsedTime]);

  const formattedElapsedTime = formatTime(localValue);
  const formattedDuration = formatTime(duration);

  return (
    <div className="flex gap-3 items-center">
      <span id="timeElapsed" className="text-sm">
        {formattedElapsedTime}
      </span>
      <LoonSlider
        value={[localValue]}
        onPointerDown={() => setIsPointerDown(true)}
        onPointerUp={() => setIsPointerDown(false)}
        onValueChange={(value) => setLocalValue(value[0])}
        onValueCommit={() => setForcedElapsedTime(localValue)}
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
