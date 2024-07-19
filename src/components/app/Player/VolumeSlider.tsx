import Slider from "rc-slider";
import React from "react";
import { setVolume, useUserStore } from "../../../common/UserContextProvider";
import "rc-slider/assets/index.css";

export default function VolumeSlider() {
  const volume = useUserStore((state) => state.userState.volume);

  return (
    <div className="w-32 mr-3">
      <Slider
        value={volume}
        min={-30}
        max={0}
        step={1}
        onChange={setVolume}
        trackStyle={{ backgroundColor: "hsl(141, 71%, 48%)", height: 4 }}
        railStyle={{ backgroundColor: "#aaa" }}
        handleStyle={{
          borderColor: "hsl(141, 11%, 88%)",
          backgroundColor: "hsl(141, 11%, 88%)",
        }}
      />
    </div>
  );
}
