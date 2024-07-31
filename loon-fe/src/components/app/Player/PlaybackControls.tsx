import React from "react";
import { FaRandom, FaVolumeOff, FaVolumeUp } from "react-icons/fa";
import {
  setMuted,
  setShuffle,
  useUserStore,
} from "../../../common/UserContextProvider";
import PlaybackButtons from "./PlaybackButtons";
import TrackDescription from "./TrackDescription";
import TrackProgressBar from "./TrackProgressBar";
import VolumeSlider from "./VolumeSlider";

export default function PlaybackControls() {
  return (
    <div className="flex flex-col items-center justify-between md:flex-row gap-4 p-3 bg-neutral-900">
      <div className="w-full md:w-1/2">
        <TrackDescription />
      </div>

      <div className="flex flex-col gap-4 md:gap-2 w-full items-center">
        <div className="w-full md:w-5/6">
          <TrackProgressBar />
        </div>
        <PlaybackButtons />
      </div>

      <div className="w-full md:w-1/2">
        <div className="flex gap-2 items-center justify-center md:justify-end ml-4">
          <ShuffleButton />
          <MuteButton />
          <VolumeSlider />
        </div>
      </div>
    </div>
  );
}

function ShuffleButton() {
  const shuffle = useUserStore((state) => state.userState.shuffle);
  function handleShuffleChange() {
    setShuffle(!shuffle);
  }

  return (
    <button
      type="button"
      className={`bg-black p-2 rounded ${shuffle ? " bg-green-700" : ""}`}
      onClick={handleShuffleChange}
    >
      <FaRandom />
    </button>
  );
}

function MuteButton() {
  const muted = useUserStore((state) => state.userState.muted);
  function handleMuteChange() {
    setMuted(!muted);
  }
  const Icon = muted ? FaVolumeOff : FaVolumeUp;

  return (
    <button
      type="button"
      className="bg-black p-2 rounded"
      onClick={handleMuteChange}
    >
      <Icon />
    </button>
  );
}
