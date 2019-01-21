import React from 'react';
import MediaItem from "./MediaItem.jsx";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedTrackIdChange = this.handleSelectedTrackIdChange.bind(this);
        this.handleCurrentPlaylistChange = this.handleCurrentPlaylistChange.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.persistDragAndDrop = this.persistDragAndDrop.bind(this);

        let playlistId = this.props.match.params.id ? this.props.match.params.id : 0;
        playlistId = Number(playlistId);
        this.state = {playlistId: playlistId};
        console.log(this.state.playlistId);
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

    render()
    {
        const tracks = this.props.tracks;
        const selectedTrackId = this.props.selectedTrackId;
        const playlists = this.props.playlists;

        const routeParamPlaylistId = this.state.playlistId;

        let mediaItems;
        const playlist = playlists.find(playlist => playlist.id === routeParamPlaylistId);
        console.log(playlist);

        let isDraggable = false;
        if (playlist)
        {
            isDraggable = true;
        }
        else
        {

        }

        if (playlist)
        {
            mediaItems = playlist.playlistTracks.map((playlistTrack, index) => {
                    const track = tracks.find(track => track.id === playlistTrack.trackId);
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
                                key={track.id} track={track} index={playlistTrack.index} selectedTrackId={selectedTrackId} onSelectedTrackIdChange={this.handleSelectedTrackIdChange} isDraggable={true}/>

                        )}
                    </Draggable>
                    )
                }
            );
        }
        else
        {
            mediaItems = tracks.map((track, index) => {
                    return <MediaItem key={track.id} track={track} index={index} selectedTrackId={selectedTrackId} onSelectedTrackIdChange={this.handleSelectedTrackIdChange} isDraggable={false}/>
                }
            );
        }

        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef}>
                            <section className={"section"}>
                                <div className="container">
                                    <h1 className="title">{playlist ? playlist.name : 'Library'}</h1>
                                </div>
                            </section>

                            <section className="section" id="root">
                                <div className="container">
                                    {/*<div className="columns is-multiline is-centered">*/}
                                        {/*<div className="column">*/}
    
                                            <div id="playlist" className="playlist">
                                                <br />
                                                <ul id="list" style={{}}>
                                                    {mediaItems}
                                                </ul>
                                            {/*</div>*/}
                                        {/*</div>*/}
                                    </div>
                                </div>

                                {/* Prevents the PlaybackControls from covering up the last few tracks. */}
                                <div style={{height: '150px'}} />
                            </section>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>);
    }
}