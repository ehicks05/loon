import React from 'react';
import MediaItem from "./MediaItem.jsx";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AutoSizer, CellMeasurer, List } from 'react-virtualized'
import 'react-virtualized/styles.css'

function parsePlaylistId(component)
{
    let playlistId = 0;
    if (component.props.match.path === '/playlists/:id')
        playlistId = component.props.match.params.id ? Number(component.props.match.params.id) : 0;
    if (component.props.match.path === '/favorites')
    {
        const favorites = component.props.playlists.filter(playlist => playlist.favorites);
        playlistId = favorites && favorites.length > 0 ? favorites[0].id : 0;
    }

    return playlistId;
}

export default class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedTrackIdChange = this.handleSelectedTrackIdChange.bind(this);
        this.handleCurrentPlaylistChange = this.handleCurrentPlaylistChange.bind(this);
        this.handleUpdatePlaylists = this.handleUpdatePlaylists.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.persistDragAndDrop = this.persistDragAndDrop.bind(this);
        this.renderMediaItem = this.renderMediaItem.bind(this);

        this.state = {playlistId: parsePlaylistId(this)};
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
                self.props.onUpdatePlaylists();
            }
            else {
                console.log('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
    }

    handleCurrentPlaylistChange(newPlaylist)
    {
        this.props.onCurrentPlaylistChange(this.state.playlistId);
    }

    handleSelectedTrackIdChange(selectedTrackId)
    {
        this.props.onCurrentPlaylistChange(this.state.playlistId, selectedTrackId);
    }

    handleUpdatePlaylists()
    {
        this.props.onUpdatePlaylists();
    }

    render()
    {
        const self = this;
        const tracks = this.props.tracks;
        const selectedTrackId = this.props.selectedTrackId;
        const playlists = this.props.playlists;
        const favoritesPlaylist = playlists.filter(playlist => playlist.favorites)[0];
        const favoritesIds = favoritesPlaylist.playlistTracks.map(playlistTrack => playlistTrack.track.id);

        const routeParamPlaylistId = this.state.playlistId;

        let mediaItems;
        const playlist = playlists.find(playlist => playlist.id === routeParamPlaylistId);

        if (playlist)
        {
            const playlistTracks = playlist.playlistTracks.sort((o1, o2) => o1.index - o2.index);
            mediaItems = playlistTracks.map((playlistTrack, index) => {
                    const track = tracks.find(track => track.id === playlistTrack.track.id);
                    return (
                    <Draggable
                        key={track.id}
                        draggableId={track.id}
                        index={index}
                    >
                        {(provided, snapshot) => (
                            <MediaItem
                                provided={provided}
                                snapshot={snapshot}
                                key={track.id} track={track} index={playlistTrack.index} selectedTrackId={selectedTrackId}
                                onSelectedTrackIdChange={this.handleSelectedTrackIdChange} onUpdatePlaylists={self.props.onUpdatePlaylists} isDraggable={true} favorite={favoritesIds.includes(track.id)}/>

                        )}
                    </Draggable>
                    )
                }
            );
        }
        else
        {
            mediaItems = tracks.map((track, index) => {
                    return <MediaItem key={track.id} track={track} index={index} selectedTrackId={selectedTrackId}
                                      onSelectedTrackIdChange={this.handleSelectedTrackIdChange} isDraggable={false} favorite={favoritesIds.includes(track.id)}/>
                }
            );
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
            <section className={'section'} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                <h1 className="title">{playlist ? playlist.name : 'Library'}</h1>

                {mediaList}
            </section>
        );
    }

    renderMediaItem(index, trackId, selectedTrackId, favoritesIds)
    {
        trackId = Number(trackId.substring(0, trackId.indexOf('-')));
        // console.log(trackId);
        const track = this.props.tracks.find((track) => track.id === trackId);
        if (!track)
            return <li>not found</li>;
        return <MediaItem key={trackId} track={track} index={index} selectedTrackId={selectedTrackId}
                          onSelectedTrackIdChange={this.handleSelectedTrackIdChange} isDraggable={false} favorite={favoritesIds.includes(track.id)}/>
    }
}