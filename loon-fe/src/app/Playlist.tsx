import {
  clearPlaylist,
  copyPlaylist,
  getPlaylistById,
  handleLocalDragAndDrop,
  useAppStore,
  useTrackMap,
} from "@/common/AppContextProvider";
import {
  setSelectedContextMenuId,
  useUserStore,
} from "@/common/UserContextProvider";
import type { PlaylistTrack, Track } from "@/common/types";
import { Button } from "@/components/Button";
import DraggingMediaItem from "@/components/DraggingMediaItem";
import MediaItem from "@/components/MediaItem";
import { TextInput } from "@/components/TextInput";
import { trpc } from "@/utils/trpc";
import {
  DragDropContext,
  Draggable,
  type DraggableProvided,
  type DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { type CSSProperties, useEffect, useRef } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { useMeasure } from "react-use";
import { FixedSizeList as List } from "react-window";

interface RowProps {
  data: {
    tracks: PlaylistTrack[];
    trackMap: Record<string, Track>;
    playlistId: string;
  };
  index: number;
  style: CSSProperties;
}

const Row = ({
  data: { tracks, trackMap, playlistId },
  index,
  style,
}: RowProps) => {
  const playlistTrack = tracks[index];
  const track = trackMap[playlistTrack.trackId];

  return (
    <Draggable draggableId={track.id} index={index}>
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

export default function Playlist() {
  const {
    params: { id: playlistId },
  } = useRouteMatch<{ id: string }>();
  const history = useHistory();

  const playlists = useAppStore((state) => state.playlists);
  const trackMap = useTrackMap();
  const selectedTrackId = useUserStore(
    (state) => state.userState.selectedTrackId,
  );

  const utils = trpc.useUtils();
  const { mutate: persistDragAndDrop } = trpc.playlist.dragAndDrop.useMutation({
    onSuccess: () => utils.playlist.list.invalidate(),
  });

  const listRef = useRef<List>(null);
  const [containerRef, { height: containerHeight }] =
    useMeasure<HTMLDivElement>();

  useEffect(() => {
    return function cleanup() {
      setSelectedContextMenuId("");
    };
  }, []);

  function onDragEnd({ source, destination }: DropResult) {
    // dropped outside the list
    if (!destination) return;
    // didn't move
    if (source.index === destination.index) return;

    const args = {
      playlistId,
      oldIndex: source.index,
      newIndex: destination.index,
    };

    handleLocalDragAndDrop(args);
    persistDragAndDrop(args);
  }

  function saveAsPlaylist() {
    const queueId = playlists.find((playlist) => playlist.queue).id;

    const formData = new FormData();
    formData.append("fromPlaylistId", queueId);
    formData.append("name", document.getElementById("playlistName").value);

    copyPlaylist(formData).then((data) =>
      history.push(`/playlists/${data.id}`),
    );
  }

  function toggleSaveAsPlaylistForm() {
    const el = document.getElementById("saveAsPlaylistForm");
    if (el) el.classList.toggle("is-invisible");
  }

  const playlist = getPlaylistById(playlistId);

  if (!playlists || !playlist) return <div>Loading...</div>;

  const selectedPlaylistTrack = playlist.playlistTracks.find(
    (playlistTrack) => playlistTrack.trackId === selectedTrackId,
  );
  const scrollToIndex = selectedPlaylistTrack
    ? playlist.playlistTracks.indexOf(selectedPlaylistTrack)
    : undefined;

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
                overscanCount={3}
                outerRef={provided.innerRef}
                itemCount={playlist.playlistTracks.length}
                itemKey={(index, data) => data.tracks[index].trackId}
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

  return (
    <div className="flex h-full flex-col gap-4">
      <section className={"flex flex-col gap-4"}>
        <h1 className="font-bold text-2xl">
          {playlist ? playlist.name : "Library"}
        </h1>
        {playlist.queue && (
          <div className={"subtitle"}>
            <span className="buttons">
              <Button
                className=""
                disabled={playlist.playlistTracks.length === 0}
                onClick={toggleSaveAsPlaylistForm}
              >
                Save as Playlist
              </Button>
              <Button
                className=""
                disabled={playlist.playlistTracks.length === 0}
                onClick={() => clearPlaylist(playlist.id)}
              >
                Clear
              </Button>

              <form id="saveAsPlaylistForm" className="is-invisible">
                <div className="field has-addons">
                  <div className="control">
                    <span>
                      <TextInput id="playlistName" />
                    </span>
                  </div>
                  <div className="control">
                    <Button className="" onClick={saveAsPlaylist}>
                      Ok
                    </Button>
                  </div>
                </div>
              </form>
            </span>
          </div>
        )}

        {playlist && !playlist.queue && !playlist.favorites && (
          <div className="subtitle">
            <Link
              to={`/playlists/${playlist.id}/edit`}
              className="p-2 bg-black rounded"
            >
              Edit
            </Link>
          </div>
        )}
      </section>

      {mediaList}
    </div>
  );

  function renderDraggingMediaItem(index: number, provided: DraggableProvided) {
    const playlistTrack = getPlaylistById(playlistId)?.playlistTracks[index];
    if (!playlistTrack) return null;

    const track = trackMap[playlistTrack.trackId];

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
