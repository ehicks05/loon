import React from 'react';
import TextInput from "./TextInput.jsx";
import Select from "./Select.jsx";
import {inject, observer} from "mobx-react";
import 'bulma-switch/dist/css/bulma-switch.min.css'

@inject('store')
@observer
export default class SystemSettings extends React.Component {
    constructor(props) {
        super(props);
        let self = this;

        this.submitForm = this.submitForm.bind(this);
        this.handleUpdateTracks = this.handleUpdateTracks.bind(this);
        this.handleUpdatePlaylists = this.handleUpdatePlaylists.bind(this);
        this.getTaskStatuses = this.getTaskStatuses.bind(this);
        this.doImageScan = this.doImageScan.bind(this);
        this.doTranscodeLibrary = this.doTranscodeLibrary.bind(this);

        self.state = {
            timeoutNumber: 0,
            taskStatuses: null,
            tasksRunning: 0
        };
    }

    componentDidMount()
    {
        let self = this;
        fetch('/api/admin/systemSettings', {method: 'GET'})
            .then(response => response.json())
            .then(data => self.setState({settings: data}));

        this.getTaskStatuses();
    }

    componentWillUnmount()
    {
        clearTimeout(this.state.timeoutNumber);
    }

    getTaskStatuses() {
        let self = this;

        fetch('/api/admin/systemSettings/getTaskStatuses', {method: 'GET'})
            .then(response => response.json())
            .then(data => {
                const tasks = data.tasks;
                const tasksRunning = data.tasksRunning;
                const taskStatuses = new Map(Object.entries(tasks));
                console.log(taskStatuses);

                self.setState({taskStatuses: taskStatuses, tasksRunning: tasksRunning});

                let tasksInProgress = Object.keys(tasks).filter((key) => tasks[key].status === 'incomplete');
                let tasksComplete = Object.keys(tasks).filter((key) => tasks[key].status === 'complete');

                if (tasksInProgress.length > 0) {
                    const timeoutNumber = setTimeout(self.getTaskStatuses, 1000);
                    self.setState({reloadLibraryWhenTaskFinishes: true, timeoutNumber: timeoutNumber})
                }
                if (tasksInProgress.length === 0) {
                    if (self.state.reloadLibraryWhenTaskFinishes) {
                        self.handleUpdateTracks(tasksComplete);
                        self.handleUpdatePlaylists(tasksComplete);
                        self.setState({reloadLibraryWhenTaskFinishes: false});
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

    submitForm(rescan, deleteTracksWithoutFiles, deleteLibrary, librarySync)
    {
        this.setState({tasksRunning: 1});
        const self = this;
        const formData = new FormData(document.getElementById('frmSystemSettings'));
        formData.append('rescan', rescan ? 'true' : 'false');
        formData.append('deleteTracksWithoutFiles', deleteTracksWithoutFiles ? 'true' : 'false');
        formData.append('deleteLibrary', deleteLibrary ? 'true' : 'false');
        formData.append('librarySync', librarySync ? 'true' : 'false');

        this.props.store.appState.updateSystemSettings(formData)
            .then(data => {
                if (rescan || librarySync)
                    setTimeout(self.getTaskStatuses, 1000);
                if (deleteTracksWithoutFiles)
                {
                    self.handleUpdateTracks('deleting tracks without files');
                    self.handleUpdatePlaylists('deleting tracks without files');
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
        const self = this;
        fetch('/api/admin/systemSettings/imageScan', {method: 'GET'})
            .then(setTimeout(self.getTaskStatuses, 1000));
    }

    doTranscodeLibrary()
    {
        const self = this;
        fetch('/api/admin/systemSettings/transcodeLibrary', {method: 'GET'})
            .then(setTimeout(self.getTaskStatuses, 1000));
    }

    render()
    {
        if (!this.state.settings || !this.state.taskStatuses)
            return (<div>Loading...</div>);

        const systemSettings = this.state.settings;
        const taskStatuses = this.state.taskStatuses;

        const trueFalse = [{value:'false', text:'False'}, {value:'true', text:'True'}];

        const transcodeQualityOptions = [
            {value:'0', text:'v0 (~240 Kbps)'},
            {value:'1', text:'v1 (~220 Kbps)'},
            {value:'2', text:'v2 (~190 Kbps)'},
            {value:'3', text:'v3 (~170 Kbps)'},
            {value:'4', text:'v4 (~160 Kbps)'},
            {value:'5', text:'v5 (~130 Kbps)'},
            {value:'6', text:'v6 (~120 Kbps)'}
        ];

        const isTasksRunning = this.state.tasksRunning > 0;

        return (
            <div>
                <section className={"section"}>
                    <h1 className="title">Admin</h1>
                    <h2 className="subtitle">
                        Modify System
                    </h2>
                </section>
                <section className="section">

                    <div className={'columns'}>
                        <div className={"column is-narrow"}>
                            <form id="frmSystemSettings" method="post" action="">
                                <TextInput id="instanceName" label="Instance Name" value={systemSettings.instanceName} />
                                <TextInput id="logonMessage" label="Welcome Message" value={systemSettings.logonMessage} size={50} />
                                <TextInput id="musicFolder" label="Music Folder" value={systemSettings.musicFolder} />
                                <TextInput id="transcodeFolder" label="Transcode Folder" value={systemSettings.transcodeFolder} />
                                <TextInput id="dataFolder" label="Data Folder" value={systemSettings.dataFolder} />
                                {/*<TextInput id="lastFmApiKey" label="Last.fm API Key" value={systemSettings.lastFmApiKey} size={50} />*/}
                                <TextInput id="spotifyClientId" label="Spotify Client Id" value={systemSettings.spotifyClientId} size={50} />
                                <TextInput id="spotifyClientSecret" label="Spotify Client Secret" value={systemSettings.spotifyClientSecret} size={50} />
                                {/*<Select id="registrationEnabled" label="Registration Enabled" items={trueFalse} value={systemSettings.registrationEnabled} required={true} />*/}
                                <div className="field">
                                    <input type="checkbox" className="switch is-rounded" id="registrationEnabled" name="registrationEnabled" defaultChecked={systemSettings.registrationEnabled} />
                                    <label htmlFor="registrationEnabled">Registration Enabled</label>
                                </div>
                                {/*<Select id="directoryWatcherEnabled" label="Directory Watcher Enabled" items={trueFalse} value={systemSettings.directoryWatcherEnabled} required={true} />*/}
                                <div className="field">
                                    <input type="checkbox" className="switch is-rounded" id="directoryWatcherEnabled" name="directoryWatcherEnabled" defaultChecked={systemSettings.directoryWatcherEnabled} />
                                    <label htmlFor="directoryWatcherEnabled">Directory Watcher Enabled</label>
                                </div>
                                <Select id="transcodeQuality" label="Transcode Quality" items={transcodeQualityOptions} value={systemSettings.transcodeQuality} required={true} />
                            </form>
                        </div>
                        <div className="column">
                            <div className={'content'}>
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