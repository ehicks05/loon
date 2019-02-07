import React, {lazy, Suspense} from 'react';
import MediaItem from "./MediaItem.jsx";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { AutoSizer, CellMeasurer, List } from 'react-virtualized'
import 'react-virtualized/styles.css'

function parsePlaylistId(component)
{
    return component.props.match.params.id ? Number(component.props.match.params.id) : 0;
}

export default class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedTrackIdChange = this.handleSelectedTrackIdChange.bind(this);
        this.handleCurrentPlaylistChange = this.handleCurrentPlaylistChange.bind(this);
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

    render()
    {
        const self = this;
        const tracks = this.props.tracks;
        const selectedTrackId = this.props.selectedTrackId;
        const playlists = this.props.playlists;

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

        if (playlist)
        {
            return (
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div className={'is-marginless is-paddingless'} ref={provided.innerRef}>
                                {/*<section className={"section"}>*/}
                                {/*<div className="container">*/}
                                {/*</div>*/}
                                {/*</section>*/}

                                <section className="section">
                                    <div className="container">
                                        {/*<div className="columns is-multiline is-centered">*/}
                                        {/*<div className="column">*/}

                                        <h1 className="title">{playlist ? playlist.name : 'Library'}</h1>
                                        <div id="playlist" className="playlist">
                                            <br />
                                            {/*<Suspense fallback={<p>LOADING!!!</p>}>*/}
                                                <ul id="list" style={{}}>
                                                    {mediaItems}
                                                </ul>
                                            {/*</Suspense>*/}
                                            {/*</div>*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                </section>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>);
        }
        else {
            return (
                <section className="section is-marginless is-paddingless">
                    <div className="container">

                        <h1 className="title">Library</h1>
                        <div id="playlist" className="playlist">
                            <ul id="list" style={{}}>
                                {mediaItems}
                            </ul>
                            {/*<AutoSizer>*/}
                                {/*{({ height, width }) => (*/}
                                    {/*<List*/}
                                        {/*height={height}*/}
                                        {/*rowHeight={({ index }) => 58}*/}
                                        {/*rowRenderer={({ index, key, style }) => <div key={key} style={style}>{self.renderMediaItem(index, key, selectedTrackId)}</div>}*/}
                                        {/*rowCount={this.props.tracks.length}*/}
                                        {/*width={width}*/}
                                    {/*/>*/}
                                {/*)}*/}
                            {/*</AutoSizer>*/}
                        </div>
                    </div>
                </section>
            );
        }

    }

    renderMediaItem(index, trackId, selectedTrackId)
    {
        trackId = Number(trackId.substring(0, trackId.indexOf('-')));
        // console.log(trackId);
        const track = this.props.tracks.find((track) => track.id === trackId);
        if (!track)
            return <li>not found</li>;
        return <MediaItem key={trackId} track={track} index={index} selectedTrackId={selectedTrackId}
                          onSelectedTrackIdChange={this.handleSelectedTrackIdChange} isDraggable={false}/>
    }
}