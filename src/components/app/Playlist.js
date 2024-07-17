import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import MediaItem from "../MediaItem";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import TextInput from "../TextInput";
import { Link, Redirect } from "react-router-dom";
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
} from "react-virtualized";
import DraggingMediaItem from "../DraggingMediaItem";
import {
  useUserStore,
  setSelectedContextMenuId,
} from "../../common/UserContextProvider";
import {
  useAppStore,
  useTrackMap,
  dragAndDrop,
  clearPlaylist,
  copyPlaylist,
  getPlaylistById,
} from "../../common/AppContextProvider";
import { useWindowSize } from "react-use";

const autoSizerStyle = { outline: 0 };
const listStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  flex: "1",
  flexGrow: "1",
};

export default function Playlist(props) {
  const [playlistId, setPlaylistId] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null);

  const selectedTrackId = useUserStore(
    (state) => state.userState.selectedTrackId
  );
  const playlists = useAppStore((state) => state.playlists);
  const trackMap = useTrackMap();
  const windowSize = useWindowSize();

  const cache = useRef(
    new CellMeasurerCache({ fixedWidth: true, defaultHeight: 58 })
  );
  let listRef = useRef({});

  useEffect(() => {
    cache.current.clearAll();

    return function cleanup() {
      setSelectedContextMenuId(null);
    };
  }, []);

  useEffect(() => {
    if (!listRef.current.recomputeRowHeights) return;

    cache.current.clearAll();
    listRef.current.recomputeRowHeights();
    listRef.current.forceUpdateGrid();
  }, [windowSize.width]);

  useEffect(() => {
    function parsePlaylistId() {
      let playlistId = 0;
      if (props.match.path === "/playlists/:id")
        playlistId = props.match.params.id ? Number(props.match.params.id) : 0;
      if (props.match.path === "/favorites") {
        const favorites = playlists.filter((playlist) => playlist.favorites);
        playlistId = favorites && favorites.length > 0 ? favorites[0].id : 0;
      }
      if (props.match.path === "/queue") {
        const queue = playlists.filter((playlist) => playlist.queue);
        playlistId = queue && queue.length > 0 ? queue[0].id : 0;
      }

      return playlistId;
    }

    setPlaylistId(parsePlaylistId());
  }, [playlists, props.match]);

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) return;

    if (result.source.index !== result.destination.index)
      persistDragAndDrop(
        playlistId,
        result.source.index,
        result.destination.index
      );
  }

  function persistDragAndDrop(playlistId, oldIndex, newIndex) {
    const formData = new FormData();
    formData.append("playlistId", playlistId);
    formData.append("oldIndex", oldIndex);
    formData.append("newIndex", newIndex);
    dragAndDrop(formData);
  }

  function saveAsPlaylist() {
    const queueId = playlists.find((playlist) => playlist.queue).id;

    const formData = new FormData();
    formData.append("fromPlaylistId", queueId);
    formData.append("name", document.getElementById("playlistName").value);

    copyPlaylist(formData).then((data) =>
      setRedirectTo("/playlists/" + data.id)
    );
  }

  function toggleSaveAsPlaylistForm() {
    const el = document.getElementById("saveAsPlaylistForm");
    if (el) el.classList.toggle("is-invisible");
  }

  if (redirectTo) return <Redirect to={redirectTo} />;

  const playlist = getPlaylistById(playlistId);

  if (!playlists || !playlist) return <div>Loading...</div>;

  const scrollToIndex = playlist.playlistTracks.indexOf(
    playlist.playlistTracks.find(
      (playlistTrack) => playlistTrack.track.id === selectedTrackId
    )
  );

  const mediaList = (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable
        droppableId="droppable"
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
              {({ width, height }) => {
                return (
                  <List
                    width={width}
                    height={height}
                    rowHeight={cache.current.rowHeight}
                    rowRenderer={({ index, key, style, parent }) =>
                      renderRow({
                        index,
                        key,
                        style,
                        parent,
                        playlistTracks: getPlaylistById(
                          playlistId
                        ).playlistTracks.slice(),
                      })
                    }
                    rowCount={playlist.playlistTracks.length}
                    scrollToAlignment={"auto"}
                    scrollToIndex={scrollToIndex}
                    overscanRowCount={3}
                    deferredMeasurementCache={cache.current}
                    estimatedRowSize={58}
                    ref={(ref) => {
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
                );
              }}
            </AutoSizer>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );

  let actions = renderActions(playlist);

  const title = playlist ? playlist.name : "Library";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flex: "1",
      }}
    >
      <section
        className={"section"}
        style={{ display: "flex", flexDirection: "column" }}
      >
        <h1 className="title">{title}</h1>
        {actions}
      </section>

      {mediaList}
    </div>
  );

  function renderRow({ index, key, style, parent, playlistTracks }) {
    // const playlistTrack = this.props.store.appState.getPlaylistById(this.state.playlistId).playlistTracks.find(track => track.index === index);
    const playlistTrack = playlistTracks[index];
    const track = trackMap[playlistTrack.track.id];

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
            rowIndex={index}
          >
            <div key={track.id + index} style={style}>
              <MediaItem
                provided={provided}
                snapshot={snapshot}
                playlistId={playlistId}
                track={track}
                trackNumber={index + 1}
              />
            </div>
          </CellMeasurer>
        )}
      </Draggable>
    );
  }

  function renderActions(playlist) {
    let actions = null;

    if (playlist && playlist.queue) {
      const disabled = playlist.playlistTracks.length === 0;
      actions = (
        <div className={"subtitle"}>
          <span className="buttons">
            <button
              className="button is-small is-success"
              disabled={disabled}
              onClick={toggleSaveAsPlaylistForm}
            >
              Save as Playlist
            </button>
            <button
              className="button is-small is-danger"
              disabled={disabled}
              onClick={() => clearPlaylist(playlist.id)}
            >
              Clear
            </button>

            <form id="saveAsPlaylistForm" className="is-invisible">
              <div className="field has-addons">
                <div className="control">
                  <span>
                    <TextInput
                      label="Name"
                      id="playlistName"
                      hideLabel={true}
                    />
                  </span>
                </div>
                <div className="control">
                  <button
                    className="button is-primary"
                    onClick={saveAsPlaylist}
                  >
                    Ok
                  </button>
                </div>
              </div>
            </form>
          </span>
        </div>
      );
    }
    if (playlist && !playlist.queue && !playlist.favorites) {
      actions = (
        <div className={"subtitle"}>
          <span className="buttons">
            <Link
              to={"/playlists/" + playlist.id + "/edit"}
              className="button is-small is-success"
            >
              Edit
            </Link>
          </span>
        </div>
      );
    }

    return actions;
  }

  function renderDraggingMediaItem(index, provided) {
    const playlistTrack = getPlaylistById(playlistId).playlistTracks[index];
    const track = trackMap[playlistTrack.track.id];

    return (
      <DraggingMediaItem
        provided={provided}
        key={track.id}
        track={track}
        trackNumber={playlistTrack.index + 1}
      />
    );
  }
}
