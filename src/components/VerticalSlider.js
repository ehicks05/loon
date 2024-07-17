import React from 'react'
import Slider, {createSliderWithTooltip} from 'rc-slider';
import 'rc-slider/assets/index.css';

const SliderWithTooltip = createSliderWithTooltip(Slider);

const marks = {
    '-12' : '-12',
    '-6' : '-6',
    '0' : '0',
    '6' : '+6',
    '12' : '+12'
};

function VerticalSlider(props) {

    return (
        <div className='slider-vertical' style={{height: '200px', margin: '8px 0'}}>
            <SliderWithTooltip
                style={{margin: 'auto'}}
                vertical
                marks={marks}
                min={-12}
                max={12}
                defaultValue={props.value}
                onChange={(value) => props.onChange(value, props.name)}
                tipFormatter={v => (v > 0 ? '+' : '') + `${v}dB`}
                tipProps={{placement: 'right'}}
                trackStyle={{ backgroundColor: 'hsl(141, 71%, 48%)', height: 4 }}
                railStyle={{backgroundColor: '#ddd'}}
                handleStyle={{borderColor: 'hsl(141, 71%, 48%)'}}
            />
        </div>
    )
}

export default VerticalSlider