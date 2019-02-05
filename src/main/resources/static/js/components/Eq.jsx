import React from 'react';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import VerticalSlider from "./VerticalSlider.jsx";

export default class Eq extends React.Component {
    constructor(props) {
        super(props);
        let self = this;

        this.submitForm = this.submitForm.bind(this);
        this.handleEqChange = this.handleEqChange.bind(this);
        this.handleSliderChange = this.handleSliderChange.bind(this);

        this.state = {};
    }

    componentDidMount()
    {
        let self = this;
        fetch('/api/admin/systemSettings', {method: 'GET'})
            .then(response => response.json()).then(data => self.setState({settings: data}));
    }

    handleEqChange(newEq)
    {
        this.props.onEqChange(newEq);
    }

    submitForm()
    {
        const self = this;
        const url = '/api/admin/systemSettings';
        const formData = new FormData(document.getElementById('frmEq'));

        fetch(url, {method: 'PUT', body: formData})
            .then(response => response.json()).then(data => {
            console.log(data);
        });
    }

    handleSliderChange(value, event)
    {
        event.preventDefault();
        console.log(event);
    }

    render()
    {
        if (!this.state.settings)
            return (<div>Loading...</div>);

        const systemSettings = this.state.settings;

        const defaultEqs = [
            {id: 0, freq: 64, gain: 0},
            {id: 1, freq: 125, gain: 2},
            {id: 2, freq: 250, gain: 0},
            {id: 3, freq: 500, gain: -5},
            {id: 4, freq: 1000, gain: 0},
            {id: 5, freq: 2000, gain: 0},
            {id: 6, freq: 4000, gain: 0},
        ];

        const eqFreqs = defaultEqs.map((eqDefault, index) => {
            return <td key={index}><input name={'eq' + index + 'freq'} type={'number'} min={20} max={20000} step={1} defaultValue={eqDefault.freq} /></td>
        });
        const eqGains = defaultEqs.map((eqDefault, index) => {
            return <td key={index}><VerticalSlider id={'eq' + index + 'gain'} name={'eq' + index + 'gain'} value={eqDefault.gain} /></td>
        });

        const eqTable =
            <table>
                <tbody>
                <tr>
                    {eqFreqs}
                </tr>
                <tr>
                    {eqGains}
                </tr>
                </tbody>
            </table>;

        const trueFalse = [{value:'false', text:'False'}, {value:'true', text:'True'}];

        return (
            <div>
                <section className={"section"}>
                    <div className="container">
                        <h1 className="title">Settings</h1>
                        <h2 className="subtitle">
                            Equalizer
                        </h2>
                    </div>
                </section>
                <section className="section">
                    <div className="container">
                        <div className="columns is-multiline is-centered">
                            <div className="column">
                                <form id="frmEq" method="post" action="">
                                    {eqTable}

                                    <span className="buttons">
                                        <input id="saveSystemButton" type="button" value="Save" className="button is-primary" onClick={(e) => this.submitForm()} />
                                    </span>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>);
    }
}