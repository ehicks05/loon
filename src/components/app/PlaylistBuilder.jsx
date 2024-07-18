import React, { useEffect, useState } from "react";
// import { Redirect } from "react-router-dom";
import { useAppStore, upsertPlaylist } from "../../common/AppContextProvider";

import {
  FaRegCheckSquare,
  FaRegPlusSquare,
  FaChevronRight,
  FaChevronDown,
  FaRegMinusSquare,
  FaRegSquare,
  FaRegFolder,
  FaRegFolderOpen,
  FaRegFile,
} from "react-icons/fa";

import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import TextInput from "../TextInput";

export default function PlaylistBuilder(props) {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState(["0", "-1", "-2"]);
  const [redirectToPlaylists, setRedirectToPlaylists] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [treeData, setTreeData] = useState(null);

  const playlists = useAppStore((state) => state.playlists);

  useEffect(() => {
    fetch("/library/getLibraryTrackPaths", { method: "GET" })
      .then((response) => response.json())
      .then((json) => setTreeData(json));
  }, []);

  useEffect(() => {
    let playlistId = props.match.params.id ? Number(props.match.params.id) : 0;
    if (playlistId) {
      const playlist = playlists.find((playlist) => playlist.id === playlistId);
      setPlaylist(playlist);
      setChecked(
        playlist.playlistTracks.map((playlistTrack) => playlistTrack.track.id)
      );
    }
  }, [playlists, props.match.params.id]);

  async function save() {
    const formData = new FormData();
    formData.append("action", playlist ? "modify" : "add");
    formData.append("playlistId", playlist ? playlist.id : 0);
    formData.append("name", document.getElementById("name").value);
    formData.append("trackIds", checked.toString());

    upsertPlaylist(formData);
    setRedirectToPlaylists(true);
  }

  function onCheck(checked) {
    setChecked(checked);
  }

  function onExpand(expanded) {
    setExpanded(expanded);
  }

  if (!treeData) return <div>Loading...</div>;

  // if (redirectToPlaylists) return <Redirect to={"/playlists"} />;

  return (
    <div>
      <section className={"section"}>
        <h1 className="title">Playlist Builder</h1>
        <h2 className="subtitle">
          {playlist ? playlist.name : "New Playlist"}
        </h2>
      </section>

      <section className="section">
        <TextInput
          id={"name"}
          label={"Name"}
          value={playlist ? playlist.name : "New Playlist"}
          required={true}
          size={50}
        />

        <label className="label">Tracks</label>
        <CheckboxTree
          nodes={treeData}
          checked={checked}
          expanded={expanded}
          onCheck={onCheck}
          onExpand={onExpand}
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

        <button className={"button is-primary"} onClick={save}>
          Save
        </button>
      </section>
    </div>
  );
}
