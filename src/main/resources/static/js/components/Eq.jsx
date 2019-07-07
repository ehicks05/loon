import React from 'react';
import VerticalSlider from "./VerticalSlider.jsx";
import {inject, observer} from "mobx-react";

@inject('store')
@observer
export default class Eq extends React.Component {
    constructor(props) {
        super(props);

        this.handleEqChange = this.handleEqChange.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);
    }

    handleEqChange(e)
    {
        const eqNum = e.target.name.substring(2, 3);
        const field = e.target.name.substring(3);
        const value = e.target.value;

        this.props.store.uiState.updateEq(eqNum, field, value);
    }

    handleSliderChange(value, name)
    {
        const eqNum = name.substring(2, 3);
        const field = name.substring(3);
        this.props.store.uiState.updateEq(eqNum, field, value);
    }

    render()
    {
        const userState = this.props.store.uiState.user.userState;

        const cellStyle = {border: '1px solid gray', verticalAlign: 'middle', padding: '8px'};

        const eqTable =
            <table style={{padding: '8px'}}>
                <tbody>
                <tr>
                    <td style={cellStyle} className={'has-text-centered'}>Freq</td>
                    <td style={cellStyle}><input className={'input has-text-right'} name={'eq1Frequency'} type={'number'} min={20} max={20000} step={1} defaultValue={userState.eq1Frequency} onChange={this.handleEqChange} /></td>
                    <td style={cellStyle}><input className={'input has-text-right'} name={'eq2Frequency'} type={'number'} min={20} max={20000} step={1} defaultValue={userState.eq2Frequency} onChange={this.handleEqChange} /></td>
                    <td style={cellStyle}><input className={'input has-text-right'} name={'eq3Frequency'} type={'number'} min={20} max={20000} step={1} defaultValue={userState.eq3Frequency} onChange={this.handleEqChange} /></td>
                    <td style={cellStyle}><input className={'input has-text-right'} name={'eq4Frequency'} type={'number'} min={20} max={20000} step={1} defaultValue={userState.eq4Frequency} onChange={this.handleEqChange} /></td>
                </tr>
                <tr>
                    <td style={cellStyle} className={'has-text-centered'}>Gain</td>
                    <td style={cellStyle}><VerticalSlider name={'eq1Gain'} value={userState.eq1Gain} onChange={this.handleSliderChange} /></td>
                    <td style={cellStyle}><VerticalSlider name={'eq2Gain'} value={userState.eq2Gain} onChange={this.handleSliderChange} /></td>
                    <td style={cellStyle}><VerticalSlider name={'eq3Gain'} value={userState.eq3Gain} onChange={this.handleSliderChange} /></td>
                    <td style={cellStyle}><VerticalSlider name={'eq4Gain'} value={userState.eq4Gain} onChange={this.handleSliderChange} /></td>
                </tr>
                <tr>
                    <td style={cellStyle} className={'has-text-centered'}>Type</td>
                    <td style={cellStyle} className={'has-text-centered'}>Low Shelf</td>
                    <td style={cellStyle} className={'has-text-centered'}>Peaking</td>
                    <td style={cellStyle} className={'has-text-centered'}>Peaking</td>
                    <td style={cellStyle} className={'has-text-centered'}>High Shelf</td>
                </tr>
                </tbody>
            </table>;

        return (
            <div>
                <section className={"section"}>
                    <h1 className="title">Settings</h1>
                    <h2 className="subtitle">Equalizer</h2>

                    {eqTable}
                </section>
            </div>);
    }
}