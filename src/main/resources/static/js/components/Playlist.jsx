import React from 'react';
import MediaItem from "./MediaItem.jsx";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {inject, observer} from "mobx-react";
import TextInput from "./TextInput.jsx";
import {Link, Redirect} from "react-router-dom";

function parsePlaylistId(component)
{
    let playlistId = 0;
    if (component.props.match.path === '/playlists/:id')
        playlistId = component.props.match.params.id ? Number(component.props.match.params.id) : 0;
    if (component.props.match.path === '/favorites')
    {
        const favorites = component.props.store.appState.playlists.filter(playlist => playlist.favorites);
        playlistId = favorites && favorites.length > 0 ? favorites[0].id : 0;
    }
    if (component.props.match.path === '/queue')
    {
        const queue = component.props.store.appState.playlists.filter(playlist => playlist.queue);
        playlistId = queue && queue.length > 0 ? queue[0].id : 0;
    }

    return playlistId;
}

@inject('store')
@observer
export default class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.persistDragAndDrop = this.persistDragAndDrop.bind(this);
        this.saveAsPlaylist = this.saveAsPlaylist.bind(this);
        this.clearPlaylist = this.clearPlaylist.bind(this);
        this.toggleSaveAsPlaylistForm = this.toggleSaveAsPlaylistForm.bind(this);

        this.state = {playlistId: parsePlaylistId(this), redirectTo: null};
    }

    componentDidMount()
    {
        this.setState({playlistId: parsePlaylistId(this)});
    }

    componentWillUnmount()
    {
        this.props.store.uiState.selectedContextMenuId = '';
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        let playlistId = parsePlaylistId(this);
        if (prevState.playlistId !== playlistId)
            this.setState({playlistId: playlistId});
    }

    onDragEnd (result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }
        
        if (result.source.index !== result.destination.index)
            this.persistDragAndDrop(this.state.playlistId, result.source.index, result.destination.index);
    }

    persistDragAndDrop(playlistId, oldIndex, newIndex)
    {
        const formData = new FormData();
        formData.append("playlistId", playlistId);
        formData.append("oldIndex", oldIndex);
        formData.append("newIndex", newIndex);
        this.props.store.appState.dragAndDrop(formData);
    }

    saveAsPlaylist() {
        const self = this;
        const queueId = this.props.store.appState.playlists.find(playlist => playlist.queue).id;

        const formData = new FormData();
        formData.append("fromPlaylistId", queueId);
        formData.append("name", document.getElementById('playlistName').value);

        this.props.store.appState.copyPlaylist(formData)
            .then(data => self.setState({redirectTo: '/playlists/' + data.id}));
    }
    
    clearPlaylist() {
        this.props.store.appState.clearPlaylist(this.state.playlistId);
    }

    toggleSaveAsPlaylistForm() {
        const el = document.getElementById('saveAsPlaylistForm');
        if (el)
            el.classList.toggle('is-invisible');
    }

    render()
    {
        if (this.state.redirectTo)
            return <Redirect to={this.state.redirectTo} />;

        const tracks = this.props.store.appState.tracks;
        const playlists = this.props.store.appState.playlists;

        const routeParamPlaylistId = this.state.playlistId;

        const playlist = playlists.find(playlist => playlist.id === routeParamPlaylistId);

        if (routeParamPlaylistId && !playlist)
            return <div>Loading...</div>;

        const mediaItems = playlist.playlistTracks.map((playlistTrack, index) => {
                const track = tracks.find(track => track.id === playlistTrack.track.id);
                return (
                    <Draggable
                        key={track.id}
                        draggableId={track.id}
                        index={index}
                    >
                        {(provided, snapshot) => (
                            <MediaItem provided={provided} snapshot={snapshot} key={track.id} playlistId={routeParamPlaylistId}
                                       track={track} trackNumber={playlistTrack.index + 1}
                            />

                        )}
                    </Draggable>
                )
            }
        );

        const mediaList = (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef}>
                            <ul id="list">
                                {mediaItems}
                            </ul>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );

        let actions = this.renderActions(playlist);

        const title = playlist ? playlist.name : 'Library';
        return (
            <>

                <section className={'section'}>
                    <h1 className="title">{title}</h1>
                    {actions}
                </section>

                {mediaList}
            </>
        );
    }

    renderActions(playlist) {
        let actions = null;

        if (playlist && playlist.queue)
        {
            const disabled = playlist.playlistTracks.length === 0;
            actions =
                <div>
                    <span className="buttons">
                        <button className="button is-success" disabled={disabled} onClick={this.toggleSaveAsPlaylistForm}>Save as Playlist</button>
                        <button className="button is-danger"  disabled={disabled} onClick={this.clearPlaylist}>Clear</button>

                        <form id="saveAsPlaylistForm" className="is-invisible">
                            <div className="field has-addons">
                                <div className="control">
                                    <span>
                                        <TextInput label="Name" id="playlistName" hideLabel={true}/>
                                    </span>
                                </div>
                                <div className="control">
                                    <a className="button is-primary" onClick={this.saveAsPlaylist}>
                                        Ok
                                    </a>
                                </div>
                            </div>
                        </form>
                    </span>
                </div>
        }
        if (playlist && !playlist.queue && !playlist.favorites)
        {
            actions =
                <div>
                    <span className="buttons">
                        <Link to={'/playlists/' + playlist.id + '/edit'} className="button is-success">Edit</Link>
                    </span>
                </div>
        }

        return actions;
    }
}