import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import React, { useEffect, useRef, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useMeasure } from "react-use";
import { FixedSizeList as List } from "react-window";
import {
  clearPlaylist,
  copyPlaylist,
  dragAndDrop,
  getPlaylistById,
  useAppStore,
  useTrackMap,
} from "../../common/AppContextProvider";
import {
  setSelectedContextMenuId,
  useUserStore,
} from "../../common/UserContextProvider";
import DraggingMediaItem from "../DraggingMediaItem";
import MediaItem from "../MediaItem";
import TextInput from "../TextInput";

const Row = ({ data: { tracks, trackMap, playlistId }, index, style }) => {
  const playlistTrack = tracks[index];
  const track = trackMap[playlistTrack.track.id];

  return (
    <Draggable draggableId={track.id} index={index} key={track.id}>
      {(provided, snapshot) => (
        <div style={style}>
          <MediaItem
            provided={provided}
            snapshot={snapshot}
            playlistId={playlistId}
            track={track}
            trackNumber={index + 1}
          />
        </div>
      )}
    </Draggable>
  );
};

export default function Playlist(props) {
  const [playlistId, setPlaylistId] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null);

  const selectedTrackId = useUserStore(
    (state) => state.userState.selectedTrackId,
  );
  const playlists = useAppStore((state) => state.playlists);
  const trackMap = useTrackMap();

  const listRef = useRef();
  const [containerRef, { height: containerHeight }] = useMeasure();

  useEffect(() => {
    return function cleanup() {
      setSelectedContextMenuId(null);
    };
  }, []);

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
        result.destination.index,
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
      setRedirectTo(`/playlists/${data.id}`),
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
      (playlistTrack) => playlistTrack.track.id === selectedTrackId,
    ),
  );

  const mediaList = (
    <div ref={containerRef} className="h-full overflow-hidden">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="droppable"
          mode="virtual"
          renderClone={(provided, snapshot, rubric) =>
            renderDraggingMediaItem(rubric.source.index, provided)
          }
        >
          {(provided, _snapshot) => (
            <div
              id="list"
              ref={provided.innerRef}
              className="flex h-full flex-grow flex-col"
            >
              <List
                ref={listRef}
                width="100%"
                height={containerHeight}
                itemData={{
                  tracks: playlist.playlistTracks.slice(),
                  trackMap,
                  playlistId,
                }}
                scrollToAlignment={"auto"}
                scrollToIndex={scrollToIndex}
                overscanCount={3}
                outerRef={provided.innerRef}
                itemCount={playlist.playlistTracks.length}
                itemKey={(_index, data) => data.id}
                itemSize={60}
              >
                {Row}
              </List>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );

  const actions = renderActions(playlist);

  const title = playlist ? playlist.name : "Library";
  return (
    <div className="flex h-full flex-col">
      <section className={"section flex flex-col"}>
        <h1 className="title">{title}</h1>
        {actions}
      </section>

      {mediaList}
    </div>
  );

  function renderActions(playlist) {
    let actions = null;

    if (playlist?.queue) {
      const disabled = playlist.playlistTracks.length === 0;
      actions = (
        <div className={"subtitle"}>
          <span className="buttons">
            <button
              type="button"
              className="button is-small is-success"
              disabled={disabled}
              onClick={toggleSaveAsPlaylistForm}
            >
              Save as Playlist
            </button>
            <button
              type="button"
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
                    type="button"
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
              to={`/playlists/${playlist.id}/edit`}
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
        key={track.id}
        provided={provided}
        track={track}
        trackNumber={playlistTrack.index + 1}
      />
    );
  }
}
