import React, {useEffect, useState} from 'react';
import TextInput from "../TextInput";
import Select from "../Select";
import 'bulma-switch/dist/css/bulma-switch.min.css'
import superFetch from "../../common/SuperFetch";

export default function SystemSettings() {
    const [settings, setSettings] = useState(null);
    const [taskState, setTaskState] = useState(null);

    useEffect(() => {
        fetch('/api/admin/systemSettings', {method: 'GET'})
            .then(response => response.json())
            .then(data => setSettings(data));
    }, []);

    useEffect(() => {
        const eventSource = new EventSource("/hello", {withCredentials: true});
        eventSource.addEventListener("taskStateUpdate", function (e) {
            setTaskState(JSON.parse(e.data));
        });
    }, []);

    function tasksInProgress() {
        if (!taskState.tasks)
            return null;

        let inProgress = Object.entries(taskState.tasks).filter((entry) => entry[1].status === 'incomplete');
        if (inProgress.filter((task) => task[0] === 'LibrarySyncTask').length === 1)
            inProgress = inProgress.filter((task) => task[0] === 'LibrarySyncTask');

        return inProgress;
    }

    function submitForm(rescan, deleteTracksWithoutFiles, deleteLibrary, librarySync)
    {
        if (deleteTracksWithoutFiles || deleteLibrary)
            if (!confirm('Are you sure?'))
                return;

        const formData = new FormData(document.getElementById('frmSystemSettings'));
        formData.append('rescan', rescan ? 'true' : 'false');
        formData.append('deleteTracksWithoutFiles', deleteTracksWithoutFiles ? 'true' : 'false');
        formData.append('deleteLibrary', deleteLibrary ? 'true' : 'false');
        formData.append('librarySync', librarySync ? 'true' : 'false');

        updateSystemSettings(formData)
            .then(() => {
                if (deleteTracksWithoutFiles || deleteLibrary)
                {
                    const action = deleteTracksWithoutFiles ? 'deleting tracks without files' : 'deleting library';
                    console.log('Finished ' + action + '. Refreshing track listing and playlists.');

                    // todo reimplement
                    // self.props.store.appState.loadTracks();
                    // self.props.store.appState.loadPlaylists();
                }
            });
    }

    function updateSystemSettings(formData) {
        return superFetch('/api/admin/systemSettings', {method: 'PUT', body: formData})
            .then(response => response.json());
    }

    function doImageScan()
    {
        fetch('/api/admin/systemSettings/imageScan', {method: 'GET'});
    }

    function doTranscodeLibrary()
    {
        fetch('/api/admin/systemSettings/transcodeLibrary', {method: 'GET'});
    }

    if (!settings || !taskState)
        return (<div>Loading...</div>);

    const transcodeQualityOptions = [
        {value:'0', text:'v0 (~240 Kbps)'},
        {value:'1', text:'v1 (~220 Kbps)'},
        {value:'2', text:'v2 (~190 Kbps)'},
        {value:'3', text:'v3 (~170 Kbps)'},
        {value:'4', text:'v4 (~160 Kbps)'},
        {value:'5', text:'v5 (~130 Kbps)'},
        {value:'6', text:'v6 (~120 Kbps)'}
    ];

    const taskStatuses = new Map(Object.entries(taskState.tasks));
    const isTasksRunning = taskState.tasksRunning > 0;

    return (
        <div>
            <SystemStatusBar tasks={taskState.tasks} tasksInProgress={tasksInProgress()} />
            <section className={"section"}>
                <h1 className="title">Admin</h1>
                <h2 className="subtitle">
                    Modify System
                </h2>
            </section>
            <section className="section">
                <form id="frmSystemSettings" method="post" action="">
                    <span className={'button is-primary'} onClick={() => submitForm(false, false, false, false)}>Save</span>
                    <br /><br />
                    <div className={'columns is-multiline'}>
                        <div className={"column is-narrow"}>
                            <div className="subtitle">General</div>
                            <TextInput id="instanceName" label="Instance Name" value={settings.instanceName} />
                            <TextInput id="logonMessage" label="Welcome Message" value={settings.logonMessage} size={50} />
                            <div className="field">
                                <input type="checkbox" className="switch is-rounded" id="registrationEnabled" name="registrationEnabled" defaultChecked={settings.registrationEnabled} />
                                <label htmlFor="registrationEnabled">Enable Registration</label>
                            </div>
                            <div className="field">
                                <input type="checkbox" className="switch is-rounded" id="directoryWatcherEnabled" name="directoryWatcherEnabled" defaultChecked={settings.directoryWatcherEnabled} />
                                <label htmlFor="directoryWatcherEnabled">Enable Directory Watcher</label>
                            </div>
                            <Select id="transcodeQuality" label="Transcode Quality" items={transcodeQualityOptions} value={settings.transcodeQuality} required={true} />
                        </div>
                        <div className={"column is-narrow"}>
                            <div className="subtitle">Locations</div>
                            <TextInput id="musicFolder" label="Music Folder" value={settings.musicFolder} />
                            <TextInput id="transcodeFolder" label="Transcode Folder" value={settings.transcodeFolder} />
                        </div>
                        <div className="column">
                            <div className={'content'}>
                                <div className="subtitle">Tasks</div>
                                <div className={'buttons has-addons'} style={{marginBottom: '0'}}>
                                    <button className="button" disabled={isTasksRunning} onClick={() => submitForm(false, false, false, true)} >Library Sync</button>
                                    <ProgressText taskStatus={taskStatuses.get('LibrarySyncTask')}/>
                                </div>
                                <div className={'buttons has-addons'} style={{marginBottom: '0', marginLeft: '16px'}}>
                                    <button type='button' className="button" disabled={isTasksRunning} onClick={() => submitForm(true, false, false, false)} >Scan for Files</button>
                                    <ProgressText taskStatus={taskStatuses.get('MusicScanner')}/>
                                </div>
                                <div className={'buttons has-addons'} style={{marginBottom: '0', marginLeft: '16px'}}>
                                    <button type='button' className="button" disabled={isTasksRunning} onClick={() => doImageScan()} >Scan for Images</button>
                                    <ProgressText taskStatus={taskStatuses.get('ImageScanner')}/>
                                </div>
                                <div className={'buttons has-addons'} style={{marginBottom: '0', marginLeft: '16px'}}>
                                    <button type='button' className="button" disabled={isTasksRunning} onClick={() => doTranscodeLibrary()} >Transcode Library</button>
                                    <ProgressText taskStatus={taskStatuses.get('TranscoderTask')}/>
                                </div>
                                <div className={'buttons'} style={{marginBottom: '0'}}>
                                    <button type='button' className="button is-danger" disabled={isTasksRunning} onClick={() => submitForm(false, true, false, false)} >Delete Tracks Without Files</button>
                                </div>
                                <div className={'buttons'} style={{marginBottom: '0'}}>
                                    <button type='button' className="button is-danger" disabled={isTasksRunning} onClick={() => submitForm(false, false, true, false)} >Delete Library</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </section>
        </div>
    );
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

function SystemStatusBar(props) {
    const tasks = props.tasks;
    if (!tasks)
        return null;

    let tasksInProgress = props.tasksInProgress;
    const progress = tasksInProgress.length !== 1
        ? 0
        : String(tasksInProgress[0][1].progress);

    return (
        <div>
            <progress className="progress is-info is-small" value={progress} max="100" style={{borderRadius: 0, height: '6px'}}>test</progress>
        </div>
    );
}