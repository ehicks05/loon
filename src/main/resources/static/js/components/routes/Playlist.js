import React, {useContext, useEffect, useRef, useState} from 'react';
import ReactDOM from 'react-dom'
import MediaItem from "../MediaItem";
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import TextInput from "../TextInput";
import {Link, Redirect} from "react-router-dom";
import {AutoSizer, CellMeasurer, CellMeasurerCache, List} from "react-virtualized";
import DraggingMediaItem from "../DraggingMediaItem";
import {UserContext} from "../../common/UserContextProvider";
import {AppContext} from "../../common/AppContextProvider";

const autoSizerStyle = {outline: 0};
const listStyle = {display: 'flex', flexDirection: 'column', height: '100%', flex: '1', flexGrow: '1'};

export default function Playlist(props) {
    const [playlistId, setPlaylistId] = useState(null);
    const [redirectTo, setRedirectTo] = useState(null);

    const userContext = useContext(UserContext);
    const appContext = useContext(AppContext);

    const cache = useRef(new CellMeasurerCache({fixedWidth: true, defaultHeight: 58}));
    let listRef = useRef({});

    useEffect(() => {
        cache.current.clearAll();

        setPlaylistId(parsePlaylistId());

        return function cleanup() {
            // this.disposer();
            userContext.selectedContextMenuId = '';
        }
    }, []);

    useEffect(() => {
        setPlaylistId(parsePlaylistId())
    }, [props.match]);

    function parsePlaylistId()
    {
        let playlistId = 0;
        if (props.match.path === '/playlists/:id')
            playlistId = props.match.params.id ? Number(props.match.params.id) : 0;
        if (props.match.path === '/favorites')
        {
            const favorites = appContext.playlists.filter(playlist => playlist.favorites);
            playlistId = favorites && favorites.length > 0 ? favorites[0].id : 0;
        }
        if (props.match.path === '/queue')
        {
            const queue = appContext.playlists.filter(playlist => playlist.queue);
            playlistId = queue && queue.length > 0 ? queue[0].id : 0;
        }

        return playlistId;
    }

    function onDragEnd(result)
    {
        // dropped outside the list
        if (!result.destination)
            return;

        if (result.source.index !== result.destination.index)
            persistDragAndDrop(playlistId, result.source.index, result.destination.index);
    }

    function persistDragAndDrop(playlistId, oldIndex, newIndex)
    {
        const formData = new FormData();
        formData.append("playlistId", playlistId);
        formData.append("oldIndex", oldIndex);
        formData.append("newIndex", newIndex);
        appContext.dragAndDrop(formData);
    }

    function saveAsPlaylist()
    {
        const queueId = appContext.playlists.find(playlist => playlist.queue).id;

        const formData = new FormData();
        formData.append("fromPlaylistId", queueId);
        formData.append("name", document.getElementById('playlistName').value);

        appContext.copyPlaylist(formData)
            .then(data => setRedirectTo('/playlists/' + data.id));
    }

    function clearPlaylist()
    {
        appContext.clearPlaylist(playlistId);
    }

    function toggleSaveAsPlaylistForm()
    {
        const el = document.getElementById('saveAsPlaylistForm');
        if (el)
            el.classList.toggle('is-invisible');
    }

    if (redirectTo)
        return <Redirect to={redirectTo}/>;

    const selectedTrackId = userContext.user.userState.lastTrackId;
    const playlist = appContext.getPlaylistById(playlistId);

    if (!appContext || !appContext.playlists || !playlist)
        return <div>Loading...</div>

    const scrollToIndex = playlist.playlistTracks.indexOf(playlist.playlistTracks.find(playlistTrack => playlistTrack.track.id === selectedTrackId));

    const mediaList = (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable"
                       mode="virtual"
                       renderClone={(provided, snapshot, rubric) => (
                           <div
                               {...provided.draggableProps}
                               {...provided.dragHandleProps}
                               ref={provided.innerRef}
                           >
                               {renderDraggingMediaItem(rubric.source.index, provided)}
                           </div>
                       )}
            >
                {(provided, snapshot) => (
                    <div id="list" ref={provided.innerRef} style={listStyle}>
                        <AutoSizer style={autoSizerStyle}>
                            {
                                ({width, height}) => {
                                    return <List
                                        width={width}
                                        height={height}
                                        rowHeight={cache.current.rowHeight}
                                        rowRenderer={({ index, key, style, parent }) => (
                                            renderRow({ index, key, style, parent, playlistTracks: appContext.getPlaylistById(playlistId).playlistTracks.slice() })
                                        )}
                                        rowCount={playlist.playlistTracks.length}
                                        scrollToAlignment={'auto'}
                                        scrollToIndex={scrollToIndex}
                                        overscanRowCount={3}
                                        deferredMeasurementCache={cache.current}
                                        estimatedRowSize={58}
                                        ref={ref => {
                                            // from https://github.com/atlassian/react-beautiful-dnd/blob/master/stories/src/virtual/react-virtualized/list.jsx
                                            // react-virtualized has no way to get the list's ref that I can so
                                            // So we use the `ReactDOM.findDOMNode(ref)` escape hatch to get the ref
                                            if (ref) {
                                                // eslint-disable-next-line react/no-find-dom-node
                                                const whatHasMyLifeComeTo = ReactDOM.findDOMNode(ref);
                                                if (whatHasMyLifeComeTo instanceof HTMLElement) {
                                                    provided.innerRef(whatHasMyLifeComeTo);
                                                    listRef.current = ref;
                                                }
                                            }
                                        }}
                                    />
                                }
                            }
                        </AutoSizer>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );

    let actions = renderActions(playlist);

    const title = playlist ? playlist.name : 'Library';
    return (
        <div style={{display: 'flex', flexDirection: 'column', height: '100%', flex: '1'}}>
            <section className={'section'} style={{display: 'flex', flexDirection: 'column'}}>
                <h1 className="title">{title}</h1>
                {actions}
            </section>

            {mediaList}
        </div>
    );

    function renderRow({index, key, style, parent, playlistTracks})
    {
        // const playlistTrack = this.props.store.appState.getPlaylistById(this.state.playlistId).playlistTracks.find(track => track.index === index);
        const playlistTrack = playlistTracks[index];
        const track = appContext.trackMap.get(playlistTrack.track.id);

        return (
            <Draggable
                style={style}
                key={track.id}
                draggableId={track.id}
                index={index}
            >
                {(provided, snapshot) => (
                    <CellMeasurer
                        style={style}
                        key={track.id}
                        cache={cache.current}
                        parent={parent}
                        columnIndex={0}
                        rowIndex={index}>
                            <div key={track.id + index} style={style}>
                                <MediaItem provided={provided} snapshot={snapshot} playlistId={playlistId}
                                           track={track} trackNumber={index + 1}
                                />
                            </div>
                    </CellMeasurer>
                )}
            </Draggable>
        );
    }

    function renderActions(playlist)
    {
        let actions = null;

        if (playlist && playlist.queue)
        {
            const disabled = playlist.playlistTracks.length === 0;
            actions =
                <div className={'subtitle'}>
                    <span className="buttons">
                        <button className="button is-small is-success" disabled={disabled} onClick={toggleSaveAsPlaylistForm}>Save as Playlist</button>
                        <button className="button is-small is-danger" disabled={disabled} onClick={clearPlaylist}>Clear</button>

                        <form id="saveAsPlaylistForm" className="is-invisible">
                            <div className="field has-addons">
                                <div className="control">
                                    <span>
                                        <TextInput label="Name" id="playlistName" hideLabel={true}/>
                                    </span>
                                </div>
                                <div className="control">
                                    <a className="button is-primary" onClick={saveAsPlaylist}>
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
                        <Link to={'/playlists/' + playlist.id + '/edit'} className="button is-small is-success">Edit</Link>
                    </span>
                </div>
        }

        return actions;
    }

    function renderDraggingMediaItem(index, provided) {
        const playlistTrack = appContext.getPlaylistById(playlistId).playlistTracks[index];
        const track = appContext.trackMap.get(playlistTrack.track.id);

        return <DraggingMediaItem provided={provided} key={track.id} track={track} trackNumber={playlistTrack.index + 1} />;
    }
}