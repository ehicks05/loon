import { Button } from "@/components/Button";
import { TextInput } from "@/components/TextInput";
import { useState } from "react";
import CheckboxTree, { type Node } from "react-checkbox-tree";
import {
  FaChevronDown,
  FaChevronRight,
  FaRegCheckSquare,
  FaRegFile,
  FaRegFolder,
  FaRegFolderOpen,
  FaRegMinusSquare,
  FaRegPlusSquare,
  FaRegSquare,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import type { Playlist, RawTrackResponse } from "@/common/types";
import { trpc } from "@/utils/trpc";

const icons = {
  check: <FaRegCheckSquare className="rct-icon rct-icon-check" />,
  uncheck: <FaRegSquare className="rct-icon rct-icon-uncheck" />,
  halfCheck: <FaRegCheckSquare className="rct-icon rct-icon-half-check" />,
  expandClose: <FaChevronRight className="rct-icon rct-icon-expand-close" />,
  expandOpen: <FaChevronDown className="rct-icon rct-icon-expand-open" />,
  expandAll: <FaRegPlusSquare className="rct-icon rct-icon-expand-all" />,
  collapseAll: <FaRegMinusSquare className="rct-icon rct-icon-collapse-all" />,
  parentClose: <FaRegFolder className="rct-icon rct-icon-parent-close" />,
  parentOpen: <FaRegFolderOpen className="rct-icon rct-icon-parent-open" />,
  leaf: <FaRegFile className="rct-icon rct-icon-leaf-close" />,
};

// expand the tree recursively until we expand a node with multiple children
const expandTree = (rootNode: Node, expandedIds: string[]) => {
  let node = rootNode;
  while (true) {
    expandedIds.push(node.value);

    const { children } = node;
    if (!children || children.length !== 1) {
      break;
    }
    node = children[0];
  }
};

const expandForest = (nodes: Node[]) => {
  const expandedIds: string[] = [];

  // each top-level node is a tree, we will expand one
  nodes.forEach((rootNode) => expandTree(rootNode, expandedIds));

  return expandedIds;
};

const tracksToNodes = (tracks: RawTrackResponse[]) => {
  let nodes: Node[] = [];

  tracks.forEach((track) => {
    const { path } = track;
    const parts = path.split("/").slice(1);

    let partialPath = "";
    let parent: Node;
    parts.forEach((part, i) => {
      let node =
        i === 0
          ? nodes.find((n) => n.value === part)
          : parent?.children?.find((c) => c.value === `${partialPath}/${part}`);

      if (!node) {
        const isLeaf = part.endsWith(".mp3") || part.endsWith(".flac");
        const value = isLeaf
          ? track.id
          : i === 0
            ? part
            : `${partialPath}/${part}`;
        node = {
          label: part,
          value,
          children: isLeaf ? undefined : [],
        };
        if (parent) {
          parent.children = [...(parent?.children || []), node];
        } else {
          nodes = [...nodes, node];
        }
      }

      partialPath = `${partialPath}/${part}`;
      parent = node;
    });
  });

  const expandedIds = expandForest(nodes);
  return { nodes, expandedIds };
};

function PlaylistBuilder({
  playlist,
  nodes,
  defaultChecked,
  defaultExpanded,
}: {
  playlist?: Playlist;
  nodes: Node[];
  defaultChecked: string[];
  defaultExpanded: string[];
}) {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [name, setName] = useState(playlist?.name || "New Playlist");
  const [checked, setChecked] = useState<string[]>(defaultChecked);
  const [expanded, setExpanded] = useState<string[]>(defaultExpanded);

  const { mutate: insertPlaylist, isPending: isInsertPending } =
    trpc.playlist.insert.useMutation({
      onSuccess: ({ id }) => {
        utils.playlist.list.invalidate();
        navigate(`/playlists/${id}`);
      },
    });
  const { mutate: updatePlaylist, isPending: isUpdatePending } =
    trpc.playlist.update.useMutation({
      onSuccess: () => utils.playlist.list.invalidate(),
    });
  const isPending = isInsertPending || isUpdatePending;

  const onClick = () =>
    playlist
      ? updatePlaylist({ id: playlist.id, name, trackIds: checked })
      : insertPlaylist({ name, trackIds: checked });

  return (
    <section className="flex flex-col justify-between h-full gap-4">
      <h1 className="text-2xl font-bold">Playlist Builder</h1>
      <TextInput
        name="name"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={playlist?.favorites || playlist?.queue}
      />

      <div className="flex flex-col h-full overflow-auto">
        <label className="">Tracks ({checked.length} selected)</label>
        <CheckboxTree
          nodes={nodes}
          checked={checked}
          expanded={expanded}
          onCheck={(checked) => setChecked(checked)}
          onExpand={(expanded) => setExpanded(expanded)}
          icons={icons}
        />
      </div>

      <Button disabled={isPending} className={"bg-green-600"} onClick={onClick}>
        {playlist ? "Update" : "Create"} Playlist
      </Button>
    </section>
  );
}

export default function Wrapper() {
  const { id } = useParams();

  const { data: tracks } = trpc.tracks.list.useQuery();
  const { data: playlist, isLoading: isLoadingPlaylist } =
    trpc.playlist.getById.useQuery(id || "", {
      enabled: !!id,
    });

  if (!tracks || isLoadingPlaylist) {
    return <div>Loading...</div>;
  }

  const { nodes, expandedIds } = tracksToNodes(tracks);
  const defaultChecked =
    playlist?.playlistTracks.map(({ trackId }) => trackId) || [];

  return (
    <PlaylistBuilder
      playlist={playlist}
      nodes={nodes}
      defaultChecked={defaultChecked}
      defaultExpanded={expandedIds}
    />
  );
}
