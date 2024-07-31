import React from "react";
import { setVolume, useUserStore } from "../../../common/UserContextProvider";
import { LoonSlider } from "../../Slider";

export default function VolumeSlider() {
  const volume = useUserStore((state) => state.userState.volume);

  return (
    <div className="w-32 max-w-32 md:w-auto md:flex-grow">
      <LoonSlider
        value={[volume]}
        onValueChange={(value) => setVolume(value[0])}
        onDoubleClick={() => setVolume(0)}
        min={-30}
        max={0}
        step={1}
      />
    </div>
  );
}
