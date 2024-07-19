import React from "react";
import { FaRandom, FaVolumeOff, FaVolumeUp } from "react-icons/fa";
import { useWindowSize } from "react-use";
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
  const isWidthOver768 = useWindowSize().width >= 768;

  return (
    <>
      <div
        className="section myLevel"
        style={{
          zIndex: "5",
          position: "static",
          padding: "8px",
          paddingBottom: "0",
        }}
      >
        <nav className="level">
          <TrackProgressBar />
        </nav>
      </div>

      <div
        className="section myLevel"
        style={{
          zIndex: "5",
          position: "static",
          padding: "8px",
          paddingTop: "0",
        }}
      >
        <nav className="level">
          <div className="level-left">
            {isWidthOver768 && <PlaybackButtons />}
            <TrackDescription />
          </div>
          <div
            className="level-right"
            style={
              isWidthOver768
                ? { marginTop: "4px", marginRight: "8px" }
                : { marginTop: "4px", marginRight: "0" }
            }
          >
            <div className="level-item">
              {!isWidthOver768 && <PlaybackButtons />}
              <ShuffleButton />
              <MuteButton />
              <VolumeSlider />
            </div>
          </div>
        </nav>
      </div>
    </>
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
      className={`button is-small${shuffle ? " is-success" : ""}`}
      style={{ marginLeft: "1.5em" }}
      onClick={handleShuffleChange}
    >
      <span className="icon">
        <FaRandom />
      </span>
    </button>
  );
}

function MuteButton() {
  const muted = useUserStore((state) => state.userState.muted);
  function handleMuteChange() {
    setMuted(!muted);
  }

  return (
    <button
      type="button"
      className="button is-small"
      style={{ margin: "0 .75em 0 .5em" }}
      onClick={handleMuteChange}
    >
      <span className="icon">
        {muted ? <FaVolumeOff fixedWidth /> : <FaVolumeUp />}
      </span>
    </button>
  );
}
