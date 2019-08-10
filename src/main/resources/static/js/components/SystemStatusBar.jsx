import React from 'react';
import {inject, observer} from "mobx-react";

@inject('store')
@observer
export default class SystemStatusBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {};
        this.reloadLibrary = this.reloadLibrary.bind(this);
    }

    componentDidMount() {
        const self = this;
        const eventSource = new EventSource("/hello", { withCredentials: true } );

        eventSource.addEventListener("taskStateUpdate", function (e) {
            self.props.store.appState.setTaskState(JSON.parse(e.data));
            self.reloadLibrary();
        });
    }

    reloadLibrary() {
        const appState = this.props.store.appState;

        let tasksInProgress = appState.tasksInProgress;

        if (tasksInProgress.length > 0) {
            this.setState({reloadLibraryWhenTaskFinishes: true})
        }
        if (tasksInProgress.length === 0) {
            if (this.state.reloadLibraryWhenTaskFinishes) {
                appState.loadTracks();
                appState.loadPlaylists();
                this.setState({reloadLibraryWhenTaskFinishes: false});
            }
        }
    }

    render() {
        const tasks = this.props.store.appState.taskState.tasks;
        if (!tasks)
            return null;

        let tasksInProgress = this.props.store.appState.tasksInProgress;

        if (tasksInProgress.length !== 1)
            return null;

        const progress = String(tasksInProgress[0][1].progress);

        return (
            <div>
                <progress className="progress is-info is-small" value={progress} max="100" style={{borderRadius: 0, height: '6px'}}>test</progress>
            </div>
        );
    }
}