import MediaItem from "@/components/MediaItem";
import { MediaItemDrag } from "@/components/MediaItemDrag";
import { getTrackById, useTrackMap } from "@/hooks/useLibraryStore";
import { usePlaylistStore } from "@/hooks/usePlaylistStore";
import { useUserStore } from "@/hooks/useUserStore";
import type { Track } from "@/types/trpc";
import { trpc } from "@/utils/trpc";
import {
  DragDropContext,
  Draggable,
  type DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { type CSSProperties, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
import { useResizeObserver } from "usehooks-ts";

interface RowProps {
  data: {
    tracks: Track[];
    playlistId: string;
  };
  index: number;
  style: CSSProperties;
}

const Row = ({ data: { tracks, playlistId }, index, style }: RowProps) => {
  const track = tracks[index];

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
  const { id: playlistId } = useParams();
  if (!playlistId) return null;

  const { playlist, handleDragAndDrop } = usePlaylistStore((state) => ({
    playlist: state.playlists.find((p) => p.id === playlistId),
    handleDragAndDrop: state.handleDragAndDrop,
  }));
  const trackMap = useTrackMap();

  const selectedTrackId = useUserStore((state) => state.selectedTrackId);
  const selectedTrackIndex = playlist?.playlistTracks.findIndex(
    (t) => t.trackId === selectedTrackId,
  );

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

    handleDragAndDrop(args);
    persistDragAndDrop(args);
  }

  useEffect(() => {
    if (selectedTrackIndex) {
      listRef.current?.scrollToItem(selectedTrackIndex, "smart");
    }
  }, [selectedTrackIndex]);

  if (!playlist) return <div>Loading...</div>;

  const mediaList = (
    <div ref={containerRef} className="h-full overflow-hidden">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable
          droppableId="droppable"
          mode="virtual"
          renderClone={(provided, _snapshot, { source: { index } }) => {
            const trackId = playlist.playlistTracks[index]?.trackId;
            const track = trackId && getTrackById(trackId);
            if (!track) return null;
            return (
              <MediaItemDrag
                key={track.id}
                provided={provided}
                track={track}
                trackNumber={index + 1}
              />
            );
          }}
        >
          {(provided, _snapshot) => (
            <div
              ref={provided.innerRef}
              className="flex h-full flex-grow flex-col"
            >
              <List
                ref={listRef}
                width="100%"
                height={containerHeight}
                itemData={{
                  tracks: playlist.playlistTracks.map(
                    (pt) => trackMap[pt.trackId],
                  ),
                  playlistId,
                }}
                overscanCount={3}
                outerRef={provided.innerRef}
                itemCount={playlist.playlistTracks.length}
                itemKey={(index, data) => data.tracks[index].id}
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
}
