import React from 'react';
import TextInput from "./TextInput.jsx";
import Select from "./Select.jsx";
import {inject, observer} from "mobx-react";

@inject('store')
@observer
export default class SystemSettings extends React.Component {
    constructor(props) {
        super(props);
        let self = this;

        this.submitForm = this.submitForm.bind(this);
        this.handleUpdateTracks = this.handleUpdateTracks.bind(this);
        this.handleUpdatePlaylists = this.handleUpdatePlaylists.bind(this);
        this.getScanProgress = this.getScanProgress.bind(this);
        this.doImageScan = this.doImageScan.bind(this);
        this.doTranscodeLibrary = this.doTranscodeLibrary.bind(this);

        self.state = {
            timeoutNumber: 0,
            scanProgress: {progress: 0, status: 'n/a'}
        };
    }

    componentDidMount()
    {
        let self = this;
        fetch('/api/admin/systemSettings', {method: 'GET'})
            .then(response => response.json()).then(data => self.setState({settings: data}));

        this.getScanProgress();
    }

    componentWillUnmount()
    {
        clearTimeout(this.state.timeoutNumber);
    }

    getScanProgress()
    {
        let self = this;

        fetch('/api/admin/systemSettings/getScanProgress/musicFileScan', {method: 'GET'})
            .then(response => response.json()).then(scanProgress => {

            console.log(scanProgress);
            self.setState({scanProgress: scanProgress});

            if (scanProgress.status === 'incomplete')
            {
                const timeoutNumber = setTimeout(self.getScanProgress, 1000);
                self.setState({reloadLibraryWhenScanFinishes: true, timeoutNumber: timeoutNumber})
            }
            if (scanProgress.status === 'complete')
            {
                if (self.state.reloadLibraryWhenScanFinishes)
                {
                    self.handleUpdateTracks('scanning library');
                    self.setState({reloadLibraryWhenScanFinishes: false})
                }
            }
        });
    }

    handleUpdateTracks(action)
    {
        console.log('Finished ' + action + ', updating track listing.');
        this.props.store.appState.loadTracks();
    }

    handleUpdatePlaylists(action)
    {
        console.log('Finished ' + action + ', updating playlist listing.');
        this.props.store.appState.loadPlaylists();
    }

    submitForm(rescan, clearLibrary, deleteLibrary)
    {
        const self = this;
        const formData = new FormData(document.getElementById('frmSystemSettings'));
        formData.append('rescan', rescan ? 'true' : 'false');
        formData.append('clearLibrary', clearLibrary ? 'true' : 'false');
        formData.append('deleteLibrary', deleteLibrary ? 'true' : 'false');

        this.props.store.appState.updateSystemSettings(formData)
            .then(data => {
                if (rescan)
                    self.getScanProgress();
                if (clearLibrary)
                {
                    self.handleUpdateTracks('clearing library');
                    self.handleUpdatePlaylists('clearing library');
                }
                if (deleteLibrary)
                {
                    self.handleUpdateTracks('deleting library');
                    self.handleUpdatePlaylists('deleting library');
                }
            });
    }

    doImageScan()
    {
        fetch('/api/admin/systemSettings/imageScan', {method: 'GET'})
            .then(response => response.json());
    }

    doTranscodeLibrary()
    {
        fetch('/api/admin/systemSettings/transcodeLibrary', {method: 'GET'})
            .then(response => response.json());
    }

    render()
    {
        if (!this.state.settings)
            return (<div>Loading...</div>);

        const systemSettings = this.state.settings;
        const scanProgress = this.state.scanProgress;
        const progressClass = 'progress is-small ' + (scanProgress.status === 'complete' ? 'is-success' : 'is-info');
        const showProgressBar = scanProgress.status === 'complete' || scanProgress.status === 'incomplete';

        const trueFalse = [{value:'false', text:'False'}, {value:'true', text:'True'}];

        const transcodeQualityOptions = [
            {value:'0', text:'v0 (best)'},
            {value:'1', text:'v1'},
            {value:'2', text:'v2'},
            {value:'3', text:'v3'},
            {value:'4', text:'v4'},
            {value:'5', text:'v5'},
            {value:'6', text:'v6'}
        ];

        return (
            <div>
                <section className={"section"}>
                    <h1 className="title">Admin</h1>
                    <h2 className="subtitle">
                        Modify System
                    </h2>
                </section>
                <section className="section">
                    <form id="frmSystemSettings" method="post" action="">
                        <TextInput id="instanceName" label="Instance Name" value={systemSettings.instanceName} />
                        <TextInput id="musicFolder" label="Music Folder" value={systemSettings.musicFolder} />
                        <TextInput id="transcodeFolder" label="Transcode Folder" value={systemSettings.transcodeFolder} />
                        <TextInput id="dataFolder" label="Data Folder" value={systemSettings.dataFolder} />
                        <TextInput id="lastFmApiKey" label="Last.fm API Key" value={systemSettings.lastFmApiKey} size={50} />
                        <TextInput id="logonMessage" label="Welcome Message" value={systemSettings.logonMessage} size={50} />
                        <Select id="registrationEnabled" label="Registration Enabled" items={trueFalse} value={systemSettings.registrationEnabled} required={true} />
                        <Select id="directoryWatcherEnabled" label="Directory Watcher Enabled" items={trueFalse} value={systemSettings.directoryWatcherEnabled} required={true} />
                        <Select id="transcodeQuality" label="Transcode Quality" items={transcodeQualityOptions} value={systemSettings.transcodeQuality} required={true} />

                        <span className="buttons">
                            <input id="saveSystemButton" type="button" value="Save" className="button is-primary" onClick={(e) => this.submitForm()} />
                            <input id="saveAndRescanButton" type="button" value="Save and Re-scan" className="button is-success" onClick={(e) => this.submitForm(true, false, false)} />
                            <input id="clearLibraryButton" type="button" value="Clear Library" className="button is-warning" onClick={(e) => this.submitForm(false, true, false)} />
                            <input id="deleteLibraryButton" type="button" value="Delete Library" className="button is-danger" onClick={(e) => this.submitForm(false, false, true)} />
                            <input id="imageScanButton" type="button" value="Scan for Images" className="button is-info" onClick={(e) => this.doImageScan()} />
                            <input id="transcodeLibraryButton" type="button" value="Transcode Library" className="button is-info" onClick={(e) => this.doTranscodeLibrary()} />
                        </span>
                    </form>
                </section>

                {
                    showProgressBar &&
                    <section className="section">
                        <div>
                            Music Scan Progress:
                            <progress style={{width: "20em"}} title={scanProgress.progress + '%'} className={progressClass}
                                      value={scanProgress.progress} max={"100"}>{scanProgress.progress}%</progress>
                        </div>
                    </section>
                }

            </div>
        );
    }
}