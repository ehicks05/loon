import React from 'react';
import TextInput from "./TextInput.jsx";
import Select from "./Select.jsx";
import {inject, observer} from "mobx-react";
import 'bulma-switch/dist/css/bulma-switch.min.css'
import superFetch from "./SuperFetch";

@inject('store')
@observer
export default class SystemSettings extends React.Component {
    constructor(props) {
        super(props);

        this.submitForm = this.submitForm.bind(this);
        this.doImageScan = this.doImageScan.bind(this);
        this.doTranscodeLibrary = this.doTranscodeLibrary.bind(this);
        this.updateSystemSettings = this.updateSystemSettings.bind(this);

        this.state = {};
    }

    componentDidMount()
    {
        let self = this;
        fetch('/api/admin/systemSettings', {method: 'GET'})
            .then(response => response.json())
            .then(data => self.setState({settings: data}));
    }

    submitForm(rescan, deleteTracksWithoutFiles, deleteLibrary, librarySync)
    {
        if (deleteTracksWithoutFiles || deleteLibrary)
            if (!confirm('Are you sure?'))
                return;

        const self = this;
        const formData = new FormData(document.getElementById('frmSystemSettings'));
        formData.append('rescan', rescan ? 'true' : 'false');
        formData.append('deleteTracksWithoutFiles', deleteTracksWithoutFiles ? 'true' : 'false');
        formData.append('deleteLibrary', deleteLibrary ? 'true' : 'false');
        formData.append('librarySync', librarySync ? 'true' : 'false');

        this.updateSystemSettings(formData)
            .then(data => {
                if (deleteTracksWithoutFiles || deleteLibrary)
                {
                    const action = deleteTracksWithoutFiles ? 'deleting tracks without files' : 'deleting library';
                    console.log('Finished ' + action + '. Refreshing track listing and playlists.');
                    self.props.store.appState.loadTracks();
                    self.props.store.appState.loadPlaylists();
                }
            });
    }

    updateSystemSettings(formData) {
        return superFetch('/api/admin/systemSettings', {method: 'PUT', body: formData})
            .then(response => response.json());
    }

    doImageScan()
    {
        fetch('/api/admin/systemSettings/imageScan', {method: 'GET'});
    }

    doTranscodeLibrary()
    {
        fetch('/api/admin/systemSettings/transcodeLibrary', {method: 'GET'});
    }

    render()
    {
        if (!this.state.settings || !this.props.store.appState.taskState.tasks)
            return (<div>Loading...</div>);

        const systemSettings = this.state.settings;

        const taskState = this.props.store.appState.taskState;
        const taskStatuses = new Map(Object.entries(taskState.tasks));

        const transcodeQualityOptions = [
            {value:'0', text:'v0 (~240 Kbps)'},
            {value:'1', text:'v1 (~220 Kbps)'},
            {value:'2', text:'v2 (~190 Kbps)'},
            {value:'3', text:'v3 (~170 Kbps)'},
            {value:'4', text:'v4 (~160 Kbps)'},
            {value:'5', text:'v5 (~130 Kbps)'},
            {value:'6', text:'v6 (~120 Kbps)'}
        ];

        const isTasksRunning = taskState.tasksRunning > 0;

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
                        <span className={'button is-primary'} onClick={(e) => this.submitForm(false, false, false, false)}>Save</span>
                        <br />
                        <br />
                        <div className={'columns is-multiline'}>
                            <div className={"column is-narrow"}>
                                <div className="subtitle">General</div>
                                <TextInput id="instanceName" label="Instance Name" value={systemSettings.instanceName} />
                                <TextInput id="logonMessage" label="Welcome Message" value={systemSettings.logonMessage} size={50} />
                                <div className="field">
                                    <input type="checkbox" className="switch is-rounded" id="registrationEnabled" name="registrationEnabled" defaultChecked={systemSettings.registrationEnabled} />
                                    <label htmlFor="registrationEnabled">Enable Registration</label>
                                </div>
                                <div className="field">
                                    <input type="checkbox" className="switch is-rounded" id="directoryWatcherEnabled" name="directoryWatcherEnabled" defaultChecked={systemSettings.directoryWatcherEnabled} />
                                    <label htmlFor="directoryWatcherEnabled">Enable Directory Watcher</label>
                                </div>
                                <Select id="transcodeQuality" label="Transcode Quality" items={transcodeQualityOptions} value={systemSettings.transcodeQuality} required={true} />
                            </div>
                            <div className={"column is-narrow"}>
                                <div className="subtitle">Locations</div>
                                <TextInput id="musicFolder" label="Music Folder" value={systemSettings.musicFolder} />
                                <TextInput id="transcodeFolder" label="Transcode Folder" value={systemSettings.transcodeFolder} />
                                <TextInput id="dataFolder" label="Data Folder" value={systemSettings.dataFolder} />
                            </div>
                            <div className={"column is-narrow"}>
                                <div className="subtitle">API Keys</div>
                                {/*<TextInput id="lastFmApiKey" label="Last.fm API Key" value={systemSettings.lastFmApiKey} size={50} />*/}
                                <TextInput id="spotifyClientId" label="Spotify Client Id" value={systemSettings.spotifyClientId} size={50} />
                                <TextInput id="spotifyClientSecret" label="Spotify Client Secret" value={systemSettings.spotifyClientSecret} size={50} />
                            </div>
                            <div className="column">
                                <div className={'content'}>
                                    <div className="subtitle">Tasks</div>
                                    <div className={'buttons has-addons'} style={{marginBottom: '0'}}>
                                        <span className="button is-dark" disabled={isTasksRunning} onClick={(e) => this.submitForm(false, false, false, true)} >Library Sync</span>
                                        <ProgressText taskStatus={taskStatuses.get('LibrarySyncTask')}/>
                                    </div>
                                    <div className={'buttons has-addons'} style={{marginBottom: '0', marginLeft: '16px'}}>
                                        <span className="button is-dark" disabled={isTasksRunning} onClick={(e) => this.submitForm(true, false, false, false)} >Scan for Files</span>
                                        <ProgressText taskStatus={taskStatuses.get('MusicScanner')}/>
                                    </div>
                                    <div className={'buttons has-addons'} style={{marginBottom: '0', marginLeft: '16px'}}>
                                        <span className="button is-dark" disabled={isTasksRunning} onClick={(e) => this.doImageScan()} >Scan for Images</span>
                                        <ProgressText taskStatus={taskStatuses.get('ImageScanner')}/>
                                    </div>
                                    <div className={'buttons has-addons'} style={{marginBottom: '0', marginLeft: '16px'}}>
                                        <span className="button is-dark" disabled={isTasksRunning} onClick={(e) => this.doTranscodeLibrary()} >Transcode Library</span>
                                        <ProgressText taskStatus={taskStatuses.get('TranscoderTask')}/>
                                    </div>
                                    <div className={'buttons'} style={{marginBottom: '0'}}>
                                        <span className="button is-danger" disabled={isTasksRunning} onClick={(e) => this.submitForm(false, true, false, false)} >Delete Tracks Without Files</span>
                                    </div>
                                    <div className={'buttons'} style={{marginBottom: '0'}}>
                                        <span className="button is-danger" disabled={isTasksRunning} onClick={(e) => this.submitForm(false, false, true, false)} >Delete Library</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </section>
            </div>
        );
    }
}

function ProgressText(props) {
    if (!props.taskStatus)
        return null;

    const progress = props.taskStatus.progress;
    const status = props.taskStatus.status;
    const progressClass = 'button ' + (status === 'complete' ? 'is-success' : 'is-info');
    const showProgressBar = status === 'complete' || status === 'incomplete';

    return showProgressBar &&
        <span className={progressClass} style={{}}>{progress}%</span>;
}