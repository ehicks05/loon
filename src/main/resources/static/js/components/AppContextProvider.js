import React, {useEffect, useState} from "react";
import superFetch from "./SuperFetch";

const AppContext = React.createContext();

function AppContextProvider(props) {
    const[tracks, setTracks] = useState(null);
    const[trackMap, setTrackMap] = useState(null);
    const[playlists, setPlaylists] = useState(null);
    const[distinctArtists, setDistinctArtists] = useState(null);

    useEffect(() => {
        loadTracks();
        loadPlaylists();
    }, []);

    useEffect(() => {
        if (!tracks)
            return;

        const tMap = new Map();
        tracks.forEach(track => {
            tMap.set(track.id, track);
        });
        setTrackMap(tMap);

        const artists = tracks.map(track => track.artist);
        setDistinctArtists([...new Set(artists)]);
    }, [tracks]);

    function loadTracks()
    {
        return fetch('/api/library', {method: 'GET'})
            .then(response => response.json())
            .then(data => setTracks(data));
    }

    function loadPlaylists()
    {
        function sort(playlist)
        {
            playlist.playlistTracks.sort((o1, o2) => {
                if (o1.index === o2.index) return 0;
                if (o1.index < o2.index) return -1;
                if (o1.index > o2.index) return 1;
            });
        }

        fetch('/api/playlists/getPlaylists', {method: 'GET'})
            .then(response => response.json())
            .then(data => {
                data.forEach(playlist => sort(playlist));
                setPlaylists(data);
            });
    }

    function addOrModifyPlaylist(formData) {
        return superFetch('/api/playlists/addOrModify', {method: 'POST', body: formData})
            .then(response => response.json())
            .then(data => { loadPlaylists(); });
    }

    function toggleTracksInPlaylist(playlistId, formData) {
        return superFetch('/api/playlists/' + playlistId, {method: 'POST', body: formData})
            .then(response => response.text())
            .then(data => { loadPlaylists(); });
    }

    function copyPlaylist(formData) {
        return superFetch('/api/playlists/copyFrom', {method: 'POST', body: formData})
            .then(response => response.json())
            .then(data => {loadPlaylists(); return data;});
    }

    function deletePlaylist(playlistId) {
        return superFetch('/api/playlists/' + playlistId, {method: 'DELETE'})
            .then(response => response.text())
            .then(data => {loadPlaylists();});
    }

    // This will will update the playlist indices locally so the change can be rendered immediately,
    // then request the backend to do the same logic and return the updated playlist data back to the client.
    // This data should be identical to the updates we made locally, but in case anything goes wrong
    // the backend will be our source of truth.
    function dragAndDrop(formData) {
        const oldIndex = Number(formData.get('oldIndex'));
        const newIndex = Number(formData.get('newIndex'));
        const low = Math.min(oldIndex, newIndex);
        const high = Math.max(oldIndex, newIndex);
        const adjustBy = newIndex < oldIndex ? 1 : -1;
        const playlistId = Number(formData.get('playlistId'));

        const playlistIndex = playlists.findIndex(playlist => playlist.id === playlistId);
        const playlist = playlists[playlistIndex];

        let updatedTracks = playlist.playlistTracks.slice();
        updatedTracks.forEach(playlistTrack => {
            if (playlistTrack.index >= low && playlistTrack.index <= high) {
                playlistTrack.index = playlistTrack.index === oldIndex ? newIndex : playlistTrack.index + adjustBy
            }
        });

        updatedTracks = updatedTracks.sort((o1, o2) => {
            if (o1.index === o2.index) return 0;
            if (o1.index < o2.index) return -1;
            if (o1.index > o2.index) return 1;
        });

        playlist.playlistTracks = updatedTracks;

        superFetch('/api/playlists/dragAndDrop', {method: 'POST', body: formData})
            .then(response => response.text())
            .then(data => {loadPlaylists();});
    }

    function clearPlaylist(playlistId) {
        const formData = new FormData();
        formData.append("mode", '');
        formData.append("replaceExisting", true);
        formData.append("trackIds", []);

        return superFetch('/api/playlists/' + playlistId, {method: 'POST', body: formData})
            .then(response => response.json())
            .then(data => {loadPlaylists();});
    }

    function getTrackById(id)
    {
        return tracks.find(it => it.id === id);
    }

    function getPlaylistById(id)
    {
        return playlists.find(it => it.id === id);
    }

    return (
        <AppContext.Provider value={{
            tracks: tracks,
            trackMap: trackMap,
            playlists: playlists,
            distinctArtists: distinctArtists,
            loadTracks: loadTracks,
            loadPlaylists: loadPlaylists,
            addOrModifyPlaylist: addOrModifyPlaylist,
            toggleTracksInPlaylist: toggleTracksInPlaylist,
            copyPlaylist: copyPlaylist,
            deletePlaylist: deletePlaylist,
            dragAndDrop: dragAndDrop,
            clearPlaylist: clearPlaylist,
            getTrackById: getTrackById,
            getPlaylistById: getPlaylistById,
        }}>
            {props.children}
        </AppContext.Provider>
    );
}

export {AppContext, AppContextProvider};