import * as Popover from "@radix-ui/react-popover";
import { FaRandom, FaVolumeOff, FaVolumeUp } from "react-icons/fa";
import { FaSliders } from "react-icons/fa6";
import {
  setMuted,
  setShuffle,
  useUserStore,
} from "../../common/UserContextProvider";
import { Equalizer } from "../Equalizer";
import PlaybackButtons from "./PlaybackButtons";
import TrackDescription from "./TrackDescription";
import TrackProgressBar from "./TrackProgressBar";
import VolumeSlider from "./VolumeSlider";

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

const EqPopover = () => {
  return (
    <Popover.Root modal>
      <Popover.Trigger asChild>
        <button type="button" className="bg-black rounded text-neutral-300 p-2">
          <FaSliders className="rotate-90" />
        </button>
      </Popover.Trigger>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content sideOffset={24}>
          <Popover.Close />
          <Popover.Arrow />
          <div className="p-2 rounded-lg shadow-2xl bg-neutral-950 text-white">
            <Equalizer />
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export function BottomPanel() {
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
        <div className="flex gap-2 items-center justify-center md:justify-end md:ml-4">
          <ShuffleButton />
          <div>
            {/* keep inside a div to handle an extra div created by Popover */}
            <EqPopover />
          </div>
          <MuteButton />
          <VolumeSlider />
        </div>
      </div>
    </div>
  );
}
