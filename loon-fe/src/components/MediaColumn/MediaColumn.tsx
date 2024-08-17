import { PLACEHOLDER_IMAGE_URL } from "@/constants";
import { getTrackById, useLibraryStore } from "@/hooks/useLibraryStore";
import { setExpandMediaColumn, useUserStore } from "@/hooks/useUserStore";
import { trpc } from "@/utils/trpc";
import { useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { Button } from "../Button";

export const Paragraphs = ({
  text,
  expanded,
}: { text?: string; expanded: boolean }) =>
  text
    ?.split("\n")
    .filter((_, i) => expanded || i === 0)
    .map((p) => (
      <div
        key={p}
        className={`flex flex-col gap-1 max-w-prose ${expanded ? "" : "line-clamp-6"}`}
      >
        {p}
      </div>
    ));

const InfoBlock = ({
  image,
  name,
  content,
}: { image: string | null; name: string; content?: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="max-w-64">
        <img
          src={image || PLACEHOLDER_IMAGE_URL}
          alt={name}
          className="rounded-lg"
        />
      </div>
      <h1 className="text-2xl font-bold">{name}</h1>
      <div className="flex flex-col items-start gap-2 text-sm">
        <Paragraphs text={content} expanded={expanded} />
        {content && (
          <Button onClick={() => setExpanded((expanded) => !expanded)}>
            {expanded ? "Less" : "More"}
          </Button>
        )}
      </div>
    </div>
  );
};

export const Content = () => {
  const selectedTrackId = useUserStore((state) => state.selectedTrackId);
  const track = getTrackById(selectedTrackId);
  const artist = useLibraryStore((state) => state.artists).find(
    (o) => o.name === track?.artist,
  );
  const album = artist?.albums.find((o) => o.name === track?.album);

  const { data: artistInfo } = trpc.artist.info.useQuery(
    { artist: artist?.name || "" },
    { enabled: !!artist?.name },
  );

  const { data: albumInfo } = trpc.album.info.useQuery(
    { artist: artist?.name || "", album: album?.name || "" },
    { enabled: !!artist?.name && !!album?.name },
  );

  if (!artist || !album) return "Welcome!";

  return (
    <div className="flex flex-col gap-8">
      <InfoBlock
        image={artist.image}
        name={artist.name}
        content={artistInfo?.bio.content}
      />
      <InfoBlock
        image={album.image}
        name={album.name}
        content={albumInfo?.wiki.content}
      />
    </div>
  );
};

export const MediaColumn = () => {
  const expanded = useUserStore((state) => state.expandMediaColumn);

  return (
    <div
      className={`hidden lg:block h-full ${expanded ? "max-w-1/3" : "w-min"} overflow-y-auto overflow-x-hidden`}
    >
      <div className="flex flex-col gap-2 items-end p-4 bg-neutral-900 rounded-lg">
        <Button
          className="aspect-square"
          onClick={() => setExpandMediaColumn(!expanded)}
        >
          {expanded ? <FaMinus /> : <FaPlus />}
        </Button>
        {expanded && <Content />}
      </div>
    </div>
  );
};
