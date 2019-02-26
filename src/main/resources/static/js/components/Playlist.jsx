import React from 'react';
import MediaItem from "./MediaItem.jsx";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {inject, observer} from "mobx-react";

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

        this.state = {playlistId: parsePlaylistId(this)};
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
        const self = this;
        const params = 'playlistId=' + playlistId + '&oldIndex=' + oldIndex + ' &newIndex=' + newIndex;
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/playlists/dragAndDrop?' + params, false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                self.props.store.appState.loadPlaylists();
            }
            else {
                console.log('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
    }

    render()
    {
        const tracks = this.props.store.appState.tracks;
        const playlists = this.props.store.appState.playlists;

        const routeParamPlaylistId = this.state.playlistId;

        let mediaItems;
        const playlist = playlists.find(playlist => playlist.id === routeParamPlaylistId);

        if (playlist)
        {
            mediaItems = playlist.playlistTracks.map((playlistTrack, index) => {
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
        }
        else
        {
            mediaItems = tracks.map((track, index) => <MediaItem key={track.id} playlistId={routeParamPlaylistId} track={track} trackNumber={index + 1} />);
        }

        let mediaList;

        if (playlist)
        {
            mediaList = (
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div ref={provided.innerRef} style={{display: 'flex', flexDirection: 'column', flex: '1', flexGrow: '1'}}>
                                <ul id="list" style={{display: 'flex', flexDirection: 'column', flex: '1', flexGrow: '1'}}>
                                    {mediaItems}
                                </ul>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>);
        }
        else {
            mediaList = (
                <ul id="list" style={{display: 'flex', flexDirection: 'column', flex: '1', flexGrow: '1'}}>
                    {mediaItems}
                </ul>
            );
        }

        return (
            <div>

                <section className={'section'} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <h1 className="title">{playlist ? playlist.name : 'Library'}</h1>
                </section>

                {mediaList}
            </div>
        );
    }
}