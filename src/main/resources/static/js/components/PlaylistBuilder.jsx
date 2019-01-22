import React from 'react';
import {Redirect} from 'react-router-dom'

import 'font-awesome/css/font-awesome.css';
import 'font-awesome/fonts/fontawesome-webfont.svg';

import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import $ from "jquery/dist/jquery.min";
import TextInput from "./TextInput.jsx";

export default class PlaylistBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.save = this.save.bind(this);

        const self = this;

        self.state = {toPlaylists: false};
        let url = '/api/playlists/getLibraryTrackPaths';

        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                self.state.treeData = JSON.parse(this.responseText);
            }
            else {
                console.log('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();

        let playlistId = this.props.match.params.id ? this.props.match.params.id : 0;
        playlistId = Number(playlistId);

        url = '/api/playlists/getPlaylist?playlistId=' + playlistId;

        xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                self.state.playlist = JSON.parse(this.responseText);
            }
            else {
                console.log('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();

        this.state.checked = [];
        this.state.expanded = [];
        if (this.state.playlist)
        {
            this.state.checked = this.state.playlist.trackIds;
        }
        this.state.expanded = ['0', '-1', '-2'];
    }

    save()
    {
        const self = this;
        const url = '/api/playlists/addOrModify';
        const formData = {};
        formData.action = this.state.playlist ? 'modify' : 'add';
        formData.playlistId = this.state.playlist ? this.state.playlist.id : 0;
        formData.name = document.getElementById('name').value;
        formData.trackIds = this.state.checked.toString();

        $.ajax({method:"POST", url: url, data: formData, success: function (data) {
                // todo: receive playlist and set state?
                self.props.onUpdatePlaylists();

                self.setState({toPlaylists: true});
            }
        });
    }

    onCheck(checked) {
        this.setState({ checked });
    }

    onExpand(expanded) {
        this.setState({ expanded });
    }

    render()
    {
        if (this.state.toPlaylists)
            return <Redirect to={'/playlists'} />;

        return (
            <div>
                <section className={"section"}>
                    <div className="container">
                        <h1 className="title">Playlist Builder</h1>
                        <h2 className="subtitle">{this.state.playlist ? this.state.playlist.name : 'New Playlist'}</h2>
                    </div>
                </section>

                <section className="section">
                    <div className="container">
                        <div className="columns is-multiline is-centered">
                            <div className="column">
                                <TextInput
                                    id={"name"}
                                    label={"Name"}
                                    value={this.state.playlist ? this.state.playlist.name : 'New Playlist'}
                                    required={true}
                                />

                                <CheckboxTree
                                    nodes={this.state.treeData}
                                    checked={this.state.checked}
                                    expanded={this.state.expanded}
                                    onCheck={this.onCheck}
                                    onExpand={this.onExpand}
                                />

                                <button className={"button is-primary"} onClick={this.save}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>);
    }
}