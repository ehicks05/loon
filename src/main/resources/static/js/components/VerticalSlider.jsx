import React, { Component } from 'react'
import Slider, {createSliderWithTooltip} from 'rc-slider';
import 'rc-slider/assets/index.css';

const SliderWithTooltip = createSliderWithTooltip(Slider);

const marks = {
    '-12' : '-12',
    '0' : '0',
    '12' : '12'
};

class VerticalSlider extends Component {
    constructor (props) {
        super(props);
    }

    render () {
        // const { value } = this.state;
        return (
            <div className='slider-vertical' style={{height: '200px', margin: '8px 0'}}>
                <SliderWithTooltip
                    style={{margin: 'auto'}}
                    vertical
                    marks={marks}
                    min={-12}
                    max={12}
                    defaultValue={this.props.value}
                    onChange={(value) => this.props.onChange(value, this.props.name)}
                    tipFormatter={v => `${v}dB`}
                    tipProps={{placement: 'right'}}
                    trackStyle={{ backgroundColor: 'hsl(141, 71%, 48%)', height: 4 }}
                    railStyle={{backgroundColor: '#ddd'}}
                    handleStyle={{borderColor: 'hsl(141, 71%, 48%)'}}
                />
            </div>
        )
    }
}

export default VerticalSlider