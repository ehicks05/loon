import { Button } from "@/components/Button";
import DraggingMediaItem from "@/components/DraggingMediaItem";
import MediaItem from "@/components/MediaItem";
import { TextInput } from "@/components/TextInput";
import {
  getPlaylistById,
  handleLocalDragAndDrop,
  useLibraryStore,
  useTrackMap,
} from "@/hooks/useLibraryStore";
import { useUserStore } from "@/hooks/useUserStore";
import type { PlaylistTrack, Track } from "@/types/trpc";
import { trpc } from "@/utils/trpc";
import {
  DragDropContext,
  Draggable,
  type DraggableProvided,
  type DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { type CSSProperties, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
import { useResizeObserver } from "usehooks-ts";

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
  const { id } = useParams();
  const playlistId = id;
  if (!playlistId) return null;

  const playlists = useLibraryStore((state) => state.playlists);
  const trackMap = useTrackMap();

  const utils = trpc.useUtils();
  const { mutate: persistDragAndDrop } = trpc.playlist.dragAndDrop.useMutation({
    onSuccess: () => utils.playlist.list.invalidate(),
  });

  const listRef = useRef<List>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { height: containerHeight = 0 } = useResizeObserver<HTMLDivElement>({
    ref: containerRef,
  });

  function onDragEnd({ source, destination }: DropResult) {
    // dropped outside the list
    if (!destination) return;
    // didn't move
    if (source.index === destination.index) return;

    if (!playlistId) return;

    const args = {
      playlistId,
      oldIndex: source.index,
      newIndex: destination.index,
    };

    handleLocalDragAndDrop(args);
    persistDragAndDrop(args);
  }

  function saveAsPlaylist() {
    // const queueId = playlists.find((playlist) => playlist.queue)?.id;
    // const args = {
    //   fromPlaylistId: queueId,
    //   name: "TODO",
    // };
  }

  const playlist = getPlaylistById(playlistId);

  const selectedTrackId = useUserStore((state) => state.selectedTrackId);
  const selectedTrackIndex = playlist?.playlistTracks.findIndex(
    (t) => t.trackId === selectedTrackId,
  );

  useEffect(() => {
    if (selectedTrackIndex) {
      listRef.current?.scrollToItem(selectedTrackIndex, "smart");
    }
  }, [selectedTrackIndex]);

  if (!playlists || !playlist) return <div>Loading...</div>;

  const mediaList = (
    <div ref={containerRef} className="h-full overflow-hidden">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="droppable"
          mode="virtual"
          renderClone={(provided, _snapshot, rubric) =>
            renderDraggingMediaItem(rubric.source.index, provided, playlistId)
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
                initialScrollOffset={(selectedTrackIndex || 0) * 60}
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
      <section className={"flex flex-col gap-2"}>
        <h1 className="font-bold text-2xl">{playlist.name}</h1>
        <div className="flex gap-4">
          {playlist.queue && (
            <>
              <Button disabled={playlist.playlistTracks.length === 0}>
                Save as Playlist
              </Button>
              <Button disabled={playlist.playlistTracks.length === 0}>
                Clear
              </Button>

              <div className="hidden">
                <TextInput id="playlistName" />
                <Button onClick={saveAsPlaylist}>Ok</Button>
              </div>
            </>
          )}
          <Link
            to={`/playlists/${playlist.id}/edit`}
            className="p-2 bg-black rounded"
          >
            Edit
          </Link>
        </div>
      </section>

      {mediaList}
    </div>
  );

  function renderDraggingMediaItem(
    index: number,
    provided: DraggableProvided,
    playlistId: string,
  ) {
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
