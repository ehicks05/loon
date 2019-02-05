import React, { Component } from 'react'
import Slider from 'react-rangeslider'

class VerticalSlider extends Component {
    constructor (props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            value: this.props.value
        }
    }

    handleChange (value)
    {
        this.setState({
            value: value
        })
    };

    render () {
        const { value } = this.state;
        return (
            <div className='slider orientation-reversed'>
                <div className='slider-group'>
                    <div className='slider-vertical'>
                        <Slider
                            min={-12}
                            max={12}
                            value={value}
                            format={value => value + ' dB'}
                            orientation='vertical'
                            onChange={this.handleChange}
                        />
                        <div className='value'>{value + ' dB'}</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default VerticalSlider