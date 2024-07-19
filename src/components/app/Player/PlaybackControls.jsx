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
    <div className="p-2 bg-neutral-800">
      <div className="w-full z-10">
        <TrackProgressBar />
      </div>

      <div className="z-10">
        <nav className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex justify-center">
            <div className="hidden md:block">
              <PlaybackButtons />
            </div>
            <TrackDescription />
          </div>
          <div className="mt-1">
            <div className="flex items-center justify-center">
              <div className="inline md:hidden">
                <PlaybackButtons />
              </div>
              <div className="flex gap-2 items-center ml-4">
                <ShuffleButton />
                <MuteButton />
                <VolumeSlider />
              </div>
            </div>
          </div>
        </nav>
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
      className={`bg-black p-2 rounded ${shuffle ? " bg-green-600" : ""}`}
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
