import type React from "react";
import { useEffect, useState } from "react";
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
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { upsertPlaylist, useAppStore } from "../../common/AppContextProvider";
import { Button } from "../Button";
import { TextInput } from "../TextInput";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import type { Playlist, Track } from "@/common/types";
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

const tracksToNodes = (tracks: Track[]) => {
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

  return nodes;
};

function PlaylistBuilder({
  playlist,
  nodes,
  checked,
  setChecked,
  expanded,
  setExpanded,
}: {
  playlist?: Playlist;
  nodes: Node[];
  checked: string[];
  setChecked: React.Dispatch<React.SetStateAction<string[]>>;
  expanded: string[];
  setExpanded: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [name, setName] = useState(playlist?.name || "New Playlist");
  const history = useHistory();
  const utils = trpc.useUtils();

  async function save() {
    upsertPlaylist(
      { id: playlist?.id, name, trackIds: checked },
      {
        onSuccess: () => {
          utils.playlist.list.invalidate();
          history.push("/library");
        },
      },
    );
  }

  const { mutate: upsertPlaylist, isPending } =
    trpc.playlist.upsert.useMutation();

  return (
    <section className="flex flex-col justify-between h-full gap-4">
      <h1 className="text-2xl font-bold">Playlist Builder</h1>
      <TextInput
        name="name"
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        size={50}
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

      <Button disabled={isPending} className={"bg-green-600"} onClick={save}>
        {playlist ? "Update" : "Create"} Playlist
      </Button>
    </section>
  );
}

export default function Wrapper() {
  const {
    params: { id },
  } = useRouteMatch<{ id: string | undefined }>();
  const [name, setName] = useState("");
  const [checked, setChecked] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  const { playlists, tracks } = useAppStore();
  const playlist = id
    ? playlists.find((playlist) => playlist.id === id)
    : undefined;
  const nodes = tracksToNodes(tracks);

  useEffect(() => {
    if (playlist) {
      setChecked(playlist.playlistTracks.map(({ trackId }) => trackId));
    }
  }, [playlist]);

  // useEffect(() => {
  //   if (nodes) {
  //     setExpanded([nodes?.[0].value]);
  //   }
  // }, [nodes]);

  if (!nodes) {
    return <div>Loading...</div>;
  }

  return (
    <PlaylistBuilder
      playlist={playlist}
      nodes={nodes}
      checked={checked}
      setChecked={setChecked}
      expanded={expanded}
      setExpanded={setExpanded}
    />
  );
}
