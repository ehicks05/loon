import React, {useContext} from "react";
import {VolumeContext} from "../../common/VolumeContextProvider";
import Slider, {createSliderWithTooltip} from "rc-slider/es";
import 'rc-slider/assets/index.css';

const SliderWithTooltip = createSliderWithTooltip(Slider);

const volumeSliderStyle = {width: '120px'};
const sliderTrackStyle = { backgroundColor: 'hsl(141, 71%, 48%)', height: 4 }
const sliderRailStyle = {backgroundColor: '#ddd'}
const sliderHandleStyle = {borderColor: 'hsl(141, 71%, 48%)'}

export default function VolumeSlider() {
    const volumeContext = useContext(VolumeContext);

    function setVolume(value) {
        volumeContext.setVolume(value);
    }

    return (
        <div style={volumeSliderStyle}>
            <SliderWithTooltip trackStyle={sliderTrackStyle}
                               railStyle={sliderRailStyle}
                               handleStyle={sliderHandleStyle}
                               value={volumeContext.volume} min={-30} max={0} step={1}
                               tipFormatter={v => `${v}dB`}
                               onChange={setVolume} />
        </div>
    );
}