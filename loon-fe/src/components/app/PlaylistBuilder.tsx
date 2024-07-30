import React, { useEffect, useState } from "react";
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
import { useRouteMatch } from "react-router-dom";
import { upsertPlaylist, useAppStore } from "../../common/AppContextProvider";
import { Button } from "../Button";
import { TextInput } from "../TextInput";
import "react-checkbox-tree/lib/react-checkbox-tree.css";

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

const pathsToNodes = (paths: string[]) => {
  let nodes: Node[] = [];

  paths.forEach((path) => {
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
        node = {
          label: part,
          value: i === 0 ? part : `${partialPath}/${part}`,
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

export default function PlaylistBuilder() {
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
  const nodes = pathsToNodes(tracks.map((track) => track.path));

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

  async function save() {
    const formData = new FormData();
    formData.append("action", playlist ? "modify" : "add");
    formData.append("playlistId", playlist ? playlist.id : "0");
    formData.append("name", name);
    formData.append("trackIds", checked.toString());

    upsertPlaylist(formData);
    // on success, redirect to /playlists
  }

  if (!nodes) {
    return <div>Loading...</div>;
  }

  console.log({ nodes });

  return (
    <section className="flex flex-col justify-between h-full gap-4">
      <h1 className="text-2xl font-bold">Playlist Builder</h1>
      <TextInput
        id={"name"}
        label={"Name"}
        value={playlist ? playlist.name : "New Playlist"}
        onChange={(e) => setName(e.target.value)}
        required={true}
        size={50}
      />

      <div className="flex flex-col h-full overflow-auto">
        <label className="">Tracks</label>
        <CheckboxTree
          nodes={nodes}
          checked={checked}
          expanded={expanded}
          onCheck={(checked) => setChecked(checked)}
          onExpand={(expanded) => setExpanded(expanded)}
          icons={icons}
        />
      </div>

      <Button className={"bg-green-600"} onClick={save}>
        Save
      </Button>
    </section>
  );
}
