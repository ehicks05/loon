import React, {useContext} from 'react';
import VerticalSlider from "./VerticalSlider";
import {UserContext} from "./UserContextProvider";

export default function Eq() {
    const userContext = useContext(UserContext);

    if (!userContext || !userContext.user)
        return <div>Loading...</div>

    function handleEqChange(e)
    {
        const eqNum = e.target.name.substring(2, 3);
        const field = e.target.name.substring(3);
        const value = e.target.value;

        userContext.setEq(eqNum, field, value);
    }

    function handleSliderChange(value, name)
    {
        const eqNum = name.substring(2, 3);
        const field = name.substring(3);
        userContext.setEq(eqNum, field, value);
    }

    const cellStyle = {border: '1px solid gray', verticalAlign: 'middle', padding: '8px'};
    const userState = userContext.user.userState;

    const eqs = [
        {name: 'eq1', frequency: userState.eq1Frequency, gain: userState.eq1Gain, type: 'Low Shelf'},
        {name: 'eq2', frequency: userState.eq2Frequency, gain: userState.eq2Gain, type: 'Peaking'},
        {name: 'eq3', frequency: userState.eq3Frequency, gain: userState.eq3Gain, type: 'Peaking'},
        {name: 'eq4', frequency: userState.eq4Frequency, gain: userState.eq4Gain, type: 'High Shelf'},
    ];

    const freqCells = eqs.map(eq =>
        <td key={eq.name} style={cellStyle}>
            <input className={'input has-text-right'} name={eq.name + 'Frequency'} type={'number'}
                   min={20} max={20000} step={1} defaultValue={eq.frequency} onChange={handleEqChange}/>
        </td>
    );
    const gainCells = eqs.map(eq => <td key={eq.name} style={cellStyle}><VerticalSlider name={eq.name + 'Gain'} value={eq.gain} onChange={handleSliderChange} /></td>);
    const typeCells = eqs.map(eq => <td key={eq.name} style={cellStyle} className={'has-text-centered'}>{eq.type}</td>);

    const eqTable =
        <table style={{padding: '8px'}}>
            <tbody>
            <tr>
                <td style={cellStyle} className={'has-text-centered'}>Freq</td>
                {freqCells}
            </tr>
            <tr>
                <td style={cellStyle} className={'has-text-centered'}>Gain</td>
                {gainCells}
            </tr>
            <tr>
                <td style={cellStyle} className={'has-text-centered'}>Type</td>
                {typeCells}
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
        </div>
    );
}