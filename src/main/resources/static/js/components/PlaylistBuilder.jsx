import React from 'react';
import {Redirect} from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronRight,faChevronDown} from '@fortawesome/free-solid-svg-icons'
import {faCheckSquare, faPlusSquare, faMinusSquare, faSquare, faFolder, faFolderOpen, faFile} from '@fortawesome/free-regular-svg-icons'

import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import TextInput from "./TextInput";
import {inject, observer} from "mobx-react";

@inject('store')
@observer
export default class PlaylistBuilder extends React.Component {
    constructor(props) {
        super(props);
        this.onCheck = this.onCheck.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.save = this.save.bind(this);

        this.state = {redirectToPlaylists: false,
            checked: [],
            expanded: ['0', '-1', '-2']
        };
    }

    componentDidMount()
    {
        const self = this;
        fetch('/api/library/getLibraryTrackPaths', {method: 'GET'})
            .then(response => response.json())
            .then(json => self.setState({treeData: json}));

        let playlistId = this.props.match.params.id ? Number(this.props.match.params.id) : 0;
        if (playlistId)
        {
            const playlist = this.props.store.appState.playlists.find(playlist => playlist.id === playlistId);
            this.setState({playlist: playlist, checked: playlist.playlistTracks.map(playlistTrack => playlistTrack.track.id)});
        }
    }

    save()
    {
        const self = this;

        const formData = new FormData();
        formData.append("action", this.state.playlist ? 'modify' : 'add');
        formData.append("playlistId", this.state.playlist ? this.state.playlist.id : 0);
        formData.append("name", document.getElementById('name').value);
        formData.append("trackIds", this.state.checked.toString());

        self.props.store.appState.addOrModifyPlaylist(formData)
            .then(data => self.setState({redirectToPlaylists: true}));
    }

    onCheck(checked) {
        this.setState({ checked });
    }

    onExpand(expanded) {
        this.setState({ expanded });
    }

    render()
    {
        if (!this.state.treeData)
            return <div>Loading...</div>;

        if (this.state.redirectToPlaylists)
            return <Redirect to={'/playlists'} />;

        return (
            <div>
                <section className={"section"}>
                        <h1 className="title">Playlist Builder</h1>
                        <h2 className="subtitle">{this.state.playlist ? this.state.playlist.name : 'New Playlist'}</h2>
                </section>

                <section className="section">
                    <TextInput
                        id={"name"}
                        label={"Name"}
                        value={this.state.playlist ? this.state.playlist.name : 'New Playlist'}
                        required={true}
                        size={50}
                    />

                    <label className="label">Tracks</label>
                    <CheckboxTree
                        nodes={this.state.treeData}
                        checked={this.state.checked}
                        expanded={this.state.expanded}
                        onCheck={this.onCheck}
                        onExpand={this.onExpand}
                        icons={{
                            check: <FontAwesomeIcon className='rct-icon rct-icon-check' icon={faCheckSquare} />,
                            uncheck: <FontAwesomeIcon className='rct-icon rct-icon-uncheck' icon={faSquare} />,
                            halfCheck: <FontAwesomeIcon className='rct-icon rct-icon-half-check' icon={faCheckSquare} />,
                            expandClose: <FontAwesomeIcon className='rct-icon rct-icon-expand-close' icon={faChevronRight} />,
                            expandOpen: <FontAwesomeIcon className='rct-icon rct-icon-expand-open' icon={faChevronDown} />,
                            expandAll: <FontAwesomeIcon className='rct-icon rct-icon-expand-all' icon={faPlusSquare} />,
                            collapseAll: <FontAwesomeIcon className='rct-icon rct-icon-collapse-all' icon={faMinusSquare} />,
                            parentClose: <FontAwesomeIcon className='rct-icon rct-icon-parent-close' icon={faFolder} />,
                            parentOpen: <FontAwesomeIcon className='rct-icon rct-icon-parent-open' icon={faFolderOpen} />,
                            leaf: <FontAwesomeIcon className='rct-icon rct-icon-leaf-close' icon={faFile} />
                        }}
                    />

                    <button className={"button is-primary"} onClick={this.save}>
                        Save
                    </button>
                </section>
            </div>);
    }
}