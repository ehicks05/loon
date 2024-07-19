import Slider from "rc-slider";
import React from "react";
import { setVolume, useUserStore } from "../../../common/UserContextProvider";
import "rc-slider/assets/index.css";

const createSliderWithTooltip = Slider.createSliderWithTooltip;

const SliderWithTooltip = createSliderWithTooltip(Slider);

const volumeSliderStyle = { width: "120px", marginRight: ".75rem" };
const sliderTrackStyle = { backgroundColor: "hsl(141, 71%, 48%)", height: 4 };
const sliderRailStyle = { backgroundColor: "#ddd" };
const sliderHandleStyle = { borderColor: "hsl(141, 71%, 48%)" };

export default function VolumeSlider() {
  const volume = useUserStore((state) => state.userState.volume);

  return (
    <div style={volumeSliderStyle}>
      <SliderWithTooltip
        trackStyle={sliderTrackStyle}
        railStyle={sliderRailStyle}
        handleStyle={sliderHandleStyle}
        value={volume}
        min={-30}
        max={0}
        step={1}
        tipFormatter={(v) => `${v}dB`}
        onChange={setVolume}
      />
    </div>
  );
}
