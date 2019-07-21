import React from 'react';
import { Client, Message } from '@stomp/stompjs';
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
        const csrfHeader = this.props.store.csrfHeader;
        const csrfToken = this.props.store.csrfToken;

        const client = new Client({
            brokerURL: "ws://" + window.location.host + "/hello",
            connectHeaders: {
                'X-CSRF-TOKEN': csrfToken
            },
            debug: function (str) {
                // console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000
        });

        const self = this;
        client.onConnect = function(frame) {
            // Do something, all subscribes must be done is this callback
            // This is needed because this will be executed after a (re)connect

            let callback = function(message) {
                // called when the client receives a STOMP message from the server
                if (message.body) {
                    self.props.store.appState.setTaskState(JSON.parse(message.body));
                    self.reloadLibrary();
                } else {
                    console.log("got empty message");
                }
            };
            let subscription = client.subscribe("/topic/messages", callback);

            // Send an initial message to receive task state.
            setTimeout(function () {
                client.publish({destination: '/app/hello', body: 'Hello'});
            }, 100);

        };

        client.onStompError = function (frame) {
            console.log('Broker reported error: ' + frame.headers['message']);
            console.log('Additional details: ' + frame.body);
        };

        client.activate();
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