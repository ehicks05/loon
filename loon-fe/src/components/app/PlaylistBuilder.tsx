import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { upsertPlaylist, useAppStore } from "../../common/AppContextProvider";

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

import CheckboxTree, { type Node } from "react-checkbox-tree";
import { TextInput } from "../TextInput";
import { Button } from "../Button";
import "react-checkbox-tree/lib/react-checkbox-tree.css";

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
        node = {
          label: part,
          value: i === 0 ? part : `${partialPath}/${part}`,
          children: [],
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
  const [expanded, setExpanded] = useState(["0", "-1", "-2"]);

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
    <div className="flex flex-col gap-4">
      <section className={"flex flex-col gap-2"}>
        <h1 className="text-2xl font-bold">Playlist Builder</h1>
        <h2 className="subtitle">
          {playlist ? playlist.name : "New Playlist"}
        </h2>
      </section>

      <section className="flex flex-col gap-2">
        <TextInput
          id={"name"}
          label={"Name"}
          value={playlist ? playlist.name : "New Playlist"}
          onChange={(e) => setName(e.target.value)}
          required={true}
          size={50}
        />

        <label className="label">Tracks</label>
        <CheckboxTree
          nodes={nodes}
          checked={checked}
          expanded={expanded}
          onCheck={(checked) => setChecked(checked)}
          onExpand={(expanded) => setExpanded(expanded)}
          icons={{
            check: <FaRegCheckSquare className="rct-icon rct-icon-check" />,
            uncheck: <FaRegSquare className="rct-icon rct-icon-uncheck" />,
            halfCheck: (
              <FaRegCheckSquare className="rct-icon rct-icon-half-check" />
            ),
            expandClose: (
              <FaChevronRight className="rct-icon rct-icon-expand-close" />
            ),
            expandOpen: (
              <FaChevronDown className="rct-icon rct-icon-expand-open" />
            ),
            expandAll: (
              <FaRegPlusSquare className="rct-icon rct-icon-expand-all" />
            ),
            collapseAll: (
              <FaRegMinusSquare className="rct-icon rct-icon-collapse-all" />
            ),
            parentClose: (
              <FaRegFolder className="rct-icon rct-icon-parent-close" />
            ),
            parentOpen: (
              <FaRegFolderOpen className="rct-icon rct-icon-parent-open" />
            ),
            leaf: <FaRegFile className="rct-icon rct-icon-leaf-close" />,
          }}
        />

        <Button className={"bg-green-600"} onClick={save}>
          Save
        </Button>
      </section>
    </div>
  );
}
