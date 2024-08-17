import { FaPause, FaPlay, FaStepBackward, FaStepForward } from "react-icons/fa";
import { usePlayerStore } from "../../common/PlayerContextProvider";
import { setSelectedTrackId } from "../../hooks/useUserStore";
import { getNewTrackId } from "../Player/trackDeterminationUtils";

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
        className="p-2 rounded hover:bg-neutral-950"
        onClick={() => handleTrackChange("prev")}
      >
        <FaStepBackward className="h-5 w-5" />
      </button>
      <button
        type="button"
        className="p-2 rounded hover:bg-neutral-950"
        onClick={() =>
          setPlaybackState(playbackState === "playing" ? "paused" : "playing")
        }
      >
        <PlaybackStateIcon className="h-7 w-7" />
      </button>
      <button
        type="button"
        className="p-2 rounded hover:bg-neutral-950"
        onClick={() => handleTrackChange("next")}
      >
        <FaStepForward className="h-5 w-5" />
      </button>
    </div>
  );
}
