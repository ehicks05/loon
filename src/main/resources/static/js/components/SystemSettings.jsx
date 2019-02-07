import React from 'react';
import TextInput from "./TextInput.jsx";
import Select from "./Select.jsx";

export default class SystemSettings extends React.Component {
    constructor(props) {
        super(props);
        let self = this;

        this.submitForm = this.submitForm.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);
        this.handleUpdateTracks = this.handleUpdateTracks.bind(this);
        this.handleUpdatePlaylists = this.handleUpdatePlaylists.bind(this);
        this.getScanProgress = this.getScanProgress.bind(this);

        self.state = {};

        self.state.scanProgress = {progress: 0, status: 'unknown'};
        // setTimeout(this.getScanProgress, 1000);
    }

    componentDidMount()
    {
        let self = this;
        fetch('/api/admin/systemSettings', {
            method: 'GET'
        }).then(response => response.json()).then(data => self.setState({settings: data}));

        this.getScanProgress();
    }

    getScanProgress()
    {
        let self = this;

        fetch('/api/admin/systemSettings/getScanProgress', {
            method: 'GET'
        }).then(response => response.json()).then(scanProgress => {
            console.log(scanProgress);
            self.setState({scanProgress: scanProgress});

            if (scanProgress.progress !== 100)
            {
                setTimeout(self.getScanProgress, 1000);
                self.setState({scanSinceLastTrackUpdate: true})
            }
            else
            {
                if (self.state.scanSinceLastTrackUpdate)
                {
                    self.handleUpdateTracks('scanning library');
                    self.setState({scanSinceLastTrackUpdate: false})
                }
            }
        });
    }

    handleThemeChange(newTheme)
    {
        this.props.onThemeChange(newTheme);
    }

    handleUpdateTracks(action)
    {
        console.log('Finished ' + action + ', updating track listing.');
        this.props.onUpdateTracks();
    }

    handleUpdatePlaylists(action)
    {
        console.log('Finished ' + action + ', updating playlist listing.');
        this.props.onUpdatePlaylists();
    }

    submitForm(rescan, clearLibrary)
    {
        const self = this;
        const rescanValue = rescan ? 'true' : 'false';
        const clearLibraryValue = clearLibrary ? 'true' : 'false';
        const url = '/api/admin/systemSettings?rescan=' + rescanValue + '&clearLibrary=' + clearLibraryValue;
        const formData = new FormData(document.getElementById('frmSystemSettings'));

        fetch(url, {
            method: 'PUT',
            body: formData
        }).then(response => response.json()).then(data => {
            self.handleThemeChange(data.theme);
            console.log(data);
            if (rescan)
                self.getScanProgress();
            if (clearLibrary)
            {
                self.handleUpdateTracks('clearing library');
                self.handleUpdatePlaylists('clearing library');
            }
        });
    }

    render()
    {
        if (!this.state.settings)
            return (<div>Loading...</div>);

        const systemSettings = this.state.settings;
        const scanProgress = this.state.scanProgress;
        const progressClass = 'progress is-small ' + (scanProgress.status === 'complete' ? 'is-success' : 'is-info');
        const showProgressBar = scanProgress.status === 'complete' || scanProgress.status === 'incomplete';

        const themes = [
            {value:'default', text:'Default'},
            {value:'cerulean', text:'Cerulean'},
            {value:'cosmo', text:'Cosmo'},
            {value:'cyborg', text:'Cyborg'},
            {value:'darkly', text:'Darkly'},
            {value:'flatly', text:'Flatly'},
            {value:'journal', text:'Journal'},
            {value:'litera', text:'Litera'},
            {value:'lumen', text:'Lumen'},
            {value:'lux', text:'Lux'},
            {value:'materia', text:'Materia'},
            {value:'minty', text:'Minty'},
            {value:'nuclear', text:'Nuclear'},
            {value:'pulse', text:'Pulse'},
            {value:'sandstone', text:'Sandstone'},
            {value:'simplex', text:'Simplex'},
            {value:'slate', text:'Slate'},
            {value:'solar', text:'Solar'},
            {value:'spacelab', text:'Spacelab'},
            {value:'superhero', text:'Superhero'},
            {value:'united', text:'United'},
            {value:'yeti', text:'Yeti'}
        ];

        const trueFalse = [{value:'false', text:'False'}, {value:'true', text:'True'}];

        const transcodeQualityOptions = [
            {value:'default', text:'Default (Don\'t Transcode)'},
            {value:'9', text:'9'},
            {value:'8', text:'8'},
            {value:'7', text:'7'},
            {value:'6', text:'6'},
            {value:'5', text:'5'},
            {value:'4', text:'4'},
            {value:'3', text:'3'},
            {value:'2', text:'2'},
            {value:'1', text:'1'}
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
                                <form id="frmSystemSettings" method="post" action="">

                                    <TextInput id="instanceName" label="Instance Name" value={systemSettings.instanceName} />
                                    <Select id="theme" label="Theme" items={themes} value={systemSettings.theme} required={true}/>
                                    <TextInput id="musicFolder" label="Music Folder" value={systemSettings.musicFolder} />
                                    <TextInput id="logonMessage" label="Welcome Message" value={systemSettings.logonMessage} size={50} />
                                    <Select id="registrationEnabled" label="Registration Enabled" items={trueFalse} value={systemSettings.registrationEnabled} required={true} />
                                    <Select id="transcodeQuality" label="Transcode Quality" items={transcodeQualityOptions} value={systemSettings.transcodeQuality} required={true} />

                                    <span className="buttons">
                                        <input id="saveSystemButton" type="button" value="Save" className="button is-primary" onClick={(e) => this.submitForm()} />
                                        <input id="saveAndRescanButton" type="button" value="Save and Re-scan" className="button is-success" onClick={(e) => this.submitForm(true, false)} />
                                        <input id="clearLibraryButton" type="button" value="Clear Library" className="button is-danger" onClick={(e) => this.submitForm(false, true)} />
                                    </span>
                                </form>
                            </div>
                        </div>

                        {
                            showProgressBar &&
                            <progress style={{width: "20em"}} title={scanProgress.progress + '%'} className={progressClass} value={scanProgress.progress} max={"100"}>{scanProgress.progress}%</progress>
                        }

                    </div>
                </section>
            </div>);
    }
}