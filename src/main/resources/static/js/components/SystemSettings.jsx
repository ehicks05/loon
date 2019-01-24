import React from 'react';
import $ from 'jquery/dist/jquery.min';
import TextInput from "./TextInput.jsx";
import Select from "./Select.jsx";

export default class SystemSettings extends React.Component {
    constructor(props) {
        super(props);
        let self = this;

        this.submitForm = this.submitForm.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);
        this.handleUpdateTracks = this.handleUpdateTracks.bind(this);
        this.getScanProgress = this.getScanProgress.bind(this);

        let xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/admin/systemSettings/form', false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                self.state = {settings: JSON.parse(this.responseText)};
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();

        self.state.scanProgress = {progress: 0, status: 'unknown'};
        // setTimeout(this.getScanProgress, 1000);
    }

    componentDidMount()
    {
        this.getScanProgress();
    }

    getScanProgress()
    {
        let self = this;
        let xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/admin/systemSettings/getScanProgress', false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                const scanProgress = JSON.parse(this.responseText);
                console.log(scanProgress);
                self.setState({scanProgress: scanProgress});

                if (scanProgress.progress !== 100)
                {
                    setTimeout(self.getScanProgress, 200);
                    self.setState({scanSinceLastTrackUpdate: true})
                }
                else
                {
                    if (self.state.scanSinceLastTrackUpdate)
                    {
                        self.handleUpdateTracks();
                        self.setState({scanSinceLastTrackUpdate: false})
                    }
                }
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
    }

    handleThemeChange(newTheme)
    {
        this.props.onThemeChange(newTheme);
    }

    handleUpdateTracks()
    {
        console.log('Finished rescan, updating track listing.');
        this.props.onUpdateTracks();
    }

    submitForm(rescan)
    {
        const self = this;
        const rescanValue = rescan ? 'true' : 'false';
        const url = '/api/admin/systemSettings/modify?id=1&rescan=' + rescanValue;
        const formData = $('#frmProject').serialize();
        console.log(url);
        $.ajax({method:"POST", url: url, data: formData, success: function (data) {
                self.handleThemeChange(data.theme);

                if (rescan)
                    self.getScanProgress();
            }
        });
    }

    render()
    {
        const systemSettings = this.state.settings;
        const scanProgress = this.state.scanProgress;
        const progressClass = 'progress ' + (scanProgress.status === 'complete' ? 'is-success' : 'is-info');
        const showProgressBar = scanProgress.status === 'complete' || scanProgress.status === 'incomplete';

        const themes = [
            {value:'default', text:'default'},
            {value:'cosmo', text:'cosmo'},
            {value:'darkly', text:'darkly'},
            {value:'flatly', text:'flatly'},
            {value:'journal', text:'journal'},
            {value:'lux', text:'lux'},
            {value:'pulse', text:'pulse'},
            {value:'simplex', text:'simplex'},
            {value:'slate', text:'slate'},
            {value:'superhero', text:'superhero'},
            {value:'united', text:'united'},
            {value:'yeti', text:'yeti'},
        ];

        return (
            <div>
                <section className={"section"}>
                    <div className="container">
                        <h1 className="title">Admin</h1>
                        <h2 className="subtitle">
                            Modify System
                        </h2>
                    </div>
                </section>
                <section className="section">
                    <div className="container">
                        <div className="columns is-multiline is-centered">
                            <div className="column">
                                <form id="frmProject" method="post" action="">

                                    <TextInput id="instanceName" label="Instance Name" value={systemSettings.instanceName} />
                                    <Select id="theme" label="Theme" items={themes} value={systemSettings.theme} required={true}/>
                                    <TextInput id="musicFolder" label="Music Folder" value={systemSettings.musicFolder} />
                                    <TextInput id="logonMessage" label="Welcome Message" value={systemSettings.logonMessage} size={50} />

                                    <input id="saveSystemButton" type="button" value="Save" className="button is-primary" onClick={(e) => this.submitForm()} />
                                    <input id="saveAndRescanButton" type="button" value="Save and Re-scan" className="button is-success" onClick={(e) => this.submitForm(true)} />
                                </form>
                            </div>
                        </div>

                        {
                            showProgressBar &&
                            <progress className={progressClass} value={scanProgress.progress} max={"100"}>{scanProgress.progress}%</progress>
                        }

                    </div>
                </section>
            </div>);
    }
}