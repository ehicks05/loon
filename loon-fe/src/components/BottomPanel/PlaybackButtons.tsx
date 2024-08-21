import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import { usePlayerStore } from "../../hooks/usePlayerStore";
import { setSelectedTrackId } from "../../hooks/useUserStore";
import { getNewTrackId } from "../Player/trackDeterminationUtils";
import { BUTTON_CLASS } from "./BottomPanel";

export default function PlaybackButtons() {
  const playbackState = usePlayerStore((state) => state.playbackState);
  const setPlaybackState = usePlayerStore((state) => state.setPlaybackState);

  function handleTrackChange(direction: "prev" | "next") {
    setSelectedTrackId(getNewTrackId(direction));
  }

  const PlaybackStateIcon = playbackState === "playing" ? FaPause : FaPlay;

  return (
    <div className="flex gap-0.5 items-center">
      <button
        type="button"
        className={BUTTON_CLASS}
        onClick={() => handleTrackChange("prev")}
      >
        <FaStepBackward className="h-5 w-5" />
      </button>
      <button
        type="button"
        className={BUTTON_CLASS}
        onClick={() =>
          setPlaybackState(playbackState === "playing" ? "paused" : "playing")
        }
      >
        <PlaybackStateIcon className="h-7 w-7" />
      </button>
      <button
        type="button"
        className={BUTTON_CLASS}
        onClick={() => handleTrackChange("next")}
      >
        <FaStepForward className="h-5 w-5" />
      </button>
    </div>
  );
}
