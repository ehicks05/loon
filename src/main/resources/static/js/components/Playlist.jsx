import React from 'react';
import MediaItem from "./MediaItem.jsx";
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {inject, observer} from "mobx-react";
import TextInput from "./TextInput.jsx";
import {Link, Redirect} from "react-router-dom";
import {AutoSizer, CellMeasurer, CellMeasurerCache, List} from "react-virtualized";
import DraggingMediaItem from "./DraggingMediaItem.jsx";
import * as mobx from "mobx";

@inject('store')
@observer
export default class Playlist extends React.Component {
    constructor(props)
    {
        super(props);

        this.parsePlaylistId = this.parsePlaylistId.bind(this);
        this.setListRef = this.setListRef.bind(this);
        this.renderRow = this.renderRow.bind(this);

        this.onDragEnd = this.onDragEnd.bind(this);
        this.persistDragAndDrop = this.persistDragAndDrop.bind(this);
        this.saveAsPlaylist = this.saveAsPlaylist.bind(this);
        this.clearPlaylist = this.clearPlaylist.bind(this);
        this.toggleSaveAsPlaylistForm = this.toggleSaveAsPlaylistForm.bind(this);
        this.getPlaylist = this.getPlaylist.bind(this);
        this.renderDraggingMediaItem = this.renderDraggingMediaItem.bind(this);

        this.state = {playlistId: this.parsePlaylistId(), redirectTo: null};
        this.cache = new CellMeasurerCache({fixedWidth: true, defaultHeight: 58});
    }

    componentDidMount()
    {
        const self = this;
        this.cache.clearAll();
        this.disposer = mobx.autorun(() => {
            const width = self.props.store.uiState.windowDimensions.width;
            const height = self.props.store.uiState.windowDimensions.height;
            const theme = self.props.store.uiState.theme;

            // wait 1 second, otherwise sometimes there are huge gaps between rows, especially when toggling light/dark mode.
            setTimeout(function () {
                self.cache.clearAll();
                self.listRef.recomputeRowHeights();
                self.listRef.forceUpdateGrid();
            }, 1000)
        });

        this.setState({
            playlistId: this.parsePlaylistId(),
        });
    }

    componentWillUnmount()
    {
        this.disposer();
        this.props.store.uiState.selectedContextMenuId = '';
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        if (prevState.playlistId !== this.parsePlaylistId())
            this.setState({playlistId: this.parsePlaylistId()});
    }

    parsePlaylistId()
    {
        let playlistId = 0;
        if (this.props.match.path === '/playlists/:id')
            playlistId = this.props.match.params.id ? Number(this.props.match.params.id) : 0;
        if (this.props.match.path === '/favorites')
        {
            const favorites = this.props.store.appState.playlists.filter(playlist => playlist.favorites);
            playlistId = favorites && favorites.length > 0 ? favorites[0].id : 0;
        }
        if (this.props.match.path === '/queue')
        {
            const queue = this.props.store.appState.playlists.filter(playlist => playlist.queue);
            playlistId = queue && queue.length > 0 ? queue[0].id : 0;
        }

        return playlistId;
    }

    getPlaylist(playlistId)
    {
        return this.props.store.appState.getPlaylistById(playlistId);
    }

    onDragEnd(result)
    {
        // dropped outside the list
        if (!result.destination)
            return;

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

    saveAsPlaylist()
    {
        const self = this;
        const queueId = this.props.store.appState.playlists.find(playlist => playlist.queue).id;

        const formData = new FormData();
        formData.append("fromPlaylistId", queueId);
        formData.append("name", document.getElementById('playlistName').value);

        this.props.store.appState.copyPlaylist(formData)
            .then(data => self.setState({redirectTo: '/playlists/' + data.id}));
    }

    clearPlaylist()
    {
        this.props.store.appState.clearPlaylist(this.state.playlistId);
    }

    toggleSaveAsPlaylistForm()
    {
        const el = document.getElementById('saveAsPlaylistForm');
        if (el)
            el.classList.toggle('is-invisible');
    }

    render()
    {
        if (this.state.redirectTo)
            return <Redirect to={this.state.redirectTo}/>;

        const self = this;

        const selectedTrackId = this.props.store.uiState.selectedTrackId;
        const playlist = this.getPlaylist(this.state.playlistId);

        if (this.state.playlistId && !playlist)
            return <div>Loading...</div>;

        this.props.store.appState.playlists.length;
        this.props.store.appState.playlists.forEach(playlist => playlist.playlistTracks.length);

        const scrollToIndex = playlist.playlistTracks.indexOf(playlist.playlistTracks.find(track => track.id === selectedTrackId));

        const mediaList = (
            <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable"
                           mode="virtual"
                           renderClone={(provided, snapshot, rubric) => (
                               <div
                                   {...provided.draggableProps}
                                   {...provided.dragHandleProps}
                                   ref={provided.innerRef}
                               >
                                   {self.renderDraggingMediaItem(rubric.source.index, provided)}
                               </div>
                           )}
                >
                    {(provided, snapshot) => (
                        <div id="list" ref={provided.innerRef} style={{display: 'flex', flexDirection: 'column', height: '100%', flex: '1', flexGrow: '1'}}>
                            <AutoSizer style={{outline: 0}}>
                                {
                                    ({width, height}) => {
                                        return <List
                                            ref={this.setListRef}
                                            width={width}
                                            height={height}
                                            rowHeight={this.cache.rowHeight}
                                            rowRenderer={({ index, key, style, parent }) => (
                                                this.renderRow({ index, key, style, parent, playlistTracks: mobx.toJS(self.props.store.appState.getPlaylistById(self.state.playlistId).playlistTracks.slice()) })
                                            )}
                                            rowCount={playlist.playlistTracks.length}
                                            scrollToIndex={scrollToIndex}
                                            overscanRowCount={3}
                                            deferredMeasurementCache={this.cache}
                                            estimatedRowSize={58}
                                        />
                                    }
                                }
                            </AutoSizer>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        );

        let actions = this.renderActions(playlist);

        const title = playlist ? playlist.name : 'Library';
        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%', flex: '1', overflow: 'hidden'}}>
                <section className={'section'} style={{display: 'flex', flexDirection: 'column'}}>
                    <h1 className="title">{title}</h1>
                    {actions}
                </section>

                {mediaList}
            </div>
        );
    }

    renderRow({index, key, style, parent, playlistTracks})
    {
        // const playlistTrack = this.props.store.appState.getPlaylistById(this.state.playlistId).playlistTracks.find(track => track.index === index);
        const playlistTrack = playlistTracks.find(track => track.index === index);
        const track = this.props.store.appState.tracks.find(track => track.id === playlistTrack.track.id);

        return (
            <Draggable
                style={style}
                key={track.id + index}
                draggableId={track.id}
                index={index}
            >
                {(provided, snapshot) => (
                    <CellMeasurer
                        style={style}
                        key={track.id + index}
                        cache={this.cache}
                        parent={parent}
                        columnIndex={0}
                        rowIndex={index}>
                        <div key={track.id + index} style={style}>
                            <MediaItem style={style} provided={provided} snapshot={snapshot} key={track.id + index} playlistId={this.state.playlistId}
                                       track={track} trackNumber={index + 1}
                            />
                        </div>
                    </CellMeasurer>
                )}
            </Draggable>
        );
    }

    setListRef(ref)
    {
        this.listRef = ref;
    }

    renderActions(playlist)
    {
        let actions = null;

        if (playlist && playlist.queue)
        {
            const disabled = playlist.playlistTracks.length === 0;
            actions =
                <div className={'subtitle'}>
                    <span className="buttons">
                        <button className="button is-success" disabled={disabled} onClick={this.toggleSaveAsPlaylistForm}>Save as Playlist</button>
                        <button className="button is-danger" disabled={disabled} onClick={this.clearPlaylist}>Clear</button>

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
                <div className={'subtitle'}>
                    <span className="buttons">
                        <Link to={'/playlists/' + playlist.id + '/edit'} className="button is-success">Edit</Link>
                    </span>
                </div>
        }

        return actions;
    }

    renderDraggingMediaItem(index, provided) {
        const playlistTrack = this.props.store.appState.getPlaylistById(this.state.playlistId).playlistTracks.find(track => track.index === index);
        const track = this.props.store.appState.tracks.find(track => track.id === playlistTrack.track.id);

        return <DraggingMediaItem provided={provided} key={track.id} track={track} trackNumber={playlistTrack.index + 1} />;
    }
}