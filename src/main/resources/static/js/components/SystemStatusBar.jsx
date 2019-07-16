import React from 'react';
import { Client, Message } from '@stomp/stompjs';
import {inject, observer} from "mobx-react";

@inject('store')
@observer
export default class SystemStatusBar extends React.Component {

    constructor(props) {
        super(props);
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
                console.log(str);
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
                    console.log("got message with body " + message.body);
                    self.props.store.appState.setTaskState(JSON.parse(message.body));
                } else {
                    console.log("got empty message");
                }
            };
            let subscription = client.subscribe("/topic/messages", callback);

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

    render() {
        const tasks = this.props.store.appState.taskState.tasks;
        if (!tasks)
            return null;

        let inProgress = Object.entries(tasks).filter((entry) => entry[1].status === 'incomplete');
        if (inProgress.filter((task) => task[0] === 'LibrarySyncTask').length === 1)
            inProgress = inProgress.filter((task) => task[0] === 'LibrarySyncTask');

        if (inProgress.length !== 1)
            return null;

        const progress = String(inProgress[0][1].progress);

        return (
            <div>
                <progress className="progress is-info is-small" value={progress} max="100" style={{borderRadius: 0, height: '6px'}}>test</progress>
            </div>
        );
    }
}