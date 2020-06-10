import React, {useContext} from "react";
import {TimeContext} from "../../common/TimeContextProvider";
import Slider from "rc-slider/es";
import 'rc-slider/assets/index.css';

const timeElapsedLevelItemStyle = {marginBottom: '0'};
const timeElapsedStyle = {fontSize: '.875rem', marginRight: '10px'};
const progressStyle = {width: '100%', margin: '0'};
const durationStyle = {fontSize: '.875rem', marginLeft: '8px'};

const sliderTrackStyle = { backgroundColor: 'hsl(141, 71%, 48%)', height: 4 }
const sliderRailStyle = {backgroundColor: '#ddd'}
const sliderHandleStyle = {borderColor: 'hsl(141, 71%, 48%)'}

export default function TrackProgressBar(props) {
    const timeContext = useContext(TimeContext);

    const elapsedTime = timeContext.elapsedTime;
    const duration = timeContext.duration;

    const formattedElapsedTime = formatTime(Math.round(elapsedTime));
    const formattedDuration = formatTime(Math.round(duration));

    function formatTime(secs) {
        const minutes = Math.floor(secs / 60) || 0;
        const seconds = Math.round(secs - minutes * 60) || 0;

        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    function setElapsedTime(value) {
        timeContext.setElapsedTime(value);
        props.onProgressChange(value);
    }

    return (
        <div className="level-item" style={timeElapsedLevelItemStyle}>
            <span id="timeElapsed" style={timeElapsedStyle}>{formattedElapsedTime}</span>
            <Slider name="progress" id="progress" style={progressStyle}
                    trackStyle={sliderTrackStyle}
                    railStyle={sliderRailStyle}
                    handleStyle={sliderHandleStyle}
                    type="range" value={elapsedTime} max={duration} step={0.01} onChange={setElapsedTime}/>
            <span id="duration" style={durationStyle}>{formattedDuration}</span>
        </div>
    );
}