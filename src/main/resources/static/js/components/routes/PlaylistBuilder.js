import React, {useContext, useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom'

import {FaCheckSquare, FaPlusSquare, FaChevronRight, FaChevronDown, FaMinusSquare, FaSquare, FaFolder, FaFolderOpen, FaFile} from 'react-icons/fa'

import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import TextInput from "../TextInput";
import {AppContext} from "../../common/AppContextProvider";

export default function PlaylistBuilder(props) {
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState(['0', '-1', '-2']);
    const [redirectToPlaylists, setRedirectToPlaylists] = useState(false);
    const [playlist, setPlaylist] = useState(null);
    const [treeData, setTreeData] = useState(null);

    const appContext = useContext(AppContext);

    useEffect(() => {
        fetch('/api/library/getLibraryTrackPaths', {method: 'GET'})
            .then(response => response.json())
            .then(json => setTreeData(json));
    }, []);

    useEffect(() => {
        let playlistId = props.match.params.id ? Number(props.match.params.id) : 0;
        if (playlistId)
        {
            const playlist = appContext.playlists.find(playlist => playlist.id === playlistId);
            setPlaylist(playlist);
            setChecked(playlist.playlistTracks.map(playlistTrack => playlistTrack.track.id));
        }
    }, [appContext.playlists, props.match.params.id]);

    function save()
    {
        const formData = new FormData();
        formData.append("action", playlist ? 'modify' : 'add');
        formData.append("playlistId", playlist ? playlist.id : 0);
        formData.append("name", document.getElementById('name').value);
        formData.append("trackIds", checked.toString());

        appContext.addOrModifyPlaylist(formData)
            .then(() => setRedirectToPlaylists(true));
    }

    function onCheck(checked) {
        setChecked(checked);
    }

    function onExpand(expanded) {
        setExpanded(expanded);
    }

    if (!treeData)
        return <div>Loading...</div>;

    if (redirectToPlaylists)
        return <Redirect to={'/playlists'} />;

    return (
        <div>
            <section className={"section"}>
                <h1 className="title">Playlist Builder</h1>
                <h2 className="subtitle">{playlist ? playlist.name : 'New Playlist'}</h2>
            </section>

            <section className="section">
                <TextInput
                    id={"name"}
                    label={"Name"}
                    value={playlist ? playlist.name : 'New Playlist'}
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
                        check: <FaCheckSquare className='rct-icon rct-icon-check' />,
                        uncheck: <FaSquare className='rct-icon rct-icon-uncheck' />,
                        halfCheck: <FaCheckSquare className='rct-icon rct-icon-half-check' />,
                        expandClose: <FaChevronRight className='rct-icon rct-icon-expand-close' />,
                        expandOpen: <FaChevronDown className='rct-icon rct-icon-expand-open' />,
                        expandAll: <FaPlusSquare className='rct-icon rct-icon-expand-all' />,
                        collapseAll: <FaMinusSquare className='rct-icon rct-icon-collapse-all' />,
                        parentClose: <FaFolder className='rct-icon rct-icon-parent-close' />,
                        parentOpen: <FaFolderOpen className='rct-icon rct-icon-parent-open' />,
                        leaf: <FaFile className='rct-icon rct-icon-leaf-close' />
                    }}
                />

                <button className={"button is-primary"} onClick={save}>
                    Save
                </button>
            </section>
        </div>
    );
}