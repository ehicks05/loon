import React, {useContext} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEllipsisH, faHeart as fasHeart, faList, faMinus, faPlus, faSync} from '@fortawesome/free-solid-svg-icons'
import {faHeart as farHeart} from '@fortawesome/free-regular-svg-icons'
import {UserContext} from "../common/UserContextProvider";
import {AppContext} from "../common/AppContextProvider";
import useWindowSize from "../common/WindowSizeHook";

export default function ActionMenu(props) {
    const userContext = useContext(UserContext)
    const appContext = useContext(AppContext)
    const windowSize = useWindowSize()

    function toggleDropdown()
    {
        if (userContext.selectedContextMenuId === props.contextMenuId)
            userContext.setSelectedContextMenuId('');
        else
            userContext.setSelectedContextMenuId(props.contextMenuId);
    }

    function handleToggleTracksInPlaylist(playlistId, trackIds, action, replaceExisting)
    {
        const formData = new FormData();
        formData.append("trackIds", trackIds);
        formData.append("mode", action);
        formData.append("replaceExisting", replaceExisting ? replaceExisting : false);

        appContext.toggleTracksInPlaylist(playlistId, formData);
    }

    function addTracksToPlaylist(trackIds)
    {
        const playlistId = document.getElementById('mediaItem' + props.contextMenuId + 'AddToPlaylistSelect').value;
        handleToggleTracksInPlaylist(playlistId, trackIds, 'add');
    }

    function removeTracksFromPlaylist(trackIds)
    {
        const playlistId = document.getElementById('mediaItem' + props.contextMenuId + 'removeFromPlaylistSelect').value;
        handleToggleTracksInPlaylist(playlistId, trackIds, 'remove');
    }

    const tracks = props.tracks;
    const trackIds = tracks.map(track => track.id);
    const playlists = appContext.playlists;

    const favoritesPlaylist = playlists.find(playlist => playlist.favorites);
    const favoritesIds = favoritesPlaylist.playlistTracks.map(playlistTrack => playlistTrack.track.id);
    const isFavorite = trackIds.every(trackId => favoritesIds.includes(trackId));

    const queuePlaylist = playlists.find(playlist => playlist.queue);
    const queueIds = queuePlaylist.playlistTracks.map(playlistTrack => playlistTrack.track.id);
    const isQueued = trackIds.every(trackId => queueIds.includes(trackId));
    const equalsQueue = isQueued && (trackIds.length === queueIds.length);

    const contextMenuId = props.contextMenuId;
    const isDropdownActive = userContext.selectedContextMenuId === contextMenuId;

    const addToPlaylistOptions = playlists
        .filter(playlist => !playlist.favorites && !playlist.queue)
        .filter(playlist => {
            const playlistTrackIds = playlist.playlistTracks.map(playlistTrack => playlistTrack.track.id);
            return !trackIds.every(trackId => playlistTrackIds.includes(trackId));
        })
        .map(playlist =>
            <option key={playlist.id} value={playlist.id} title={playlist.name}>
                {playlist.name.length > 24 ? playlist.name.substring(0, 24) : playlist.name}
            </option>
        );

    const removeFromPlaylistOptions = playlists
        .filter(playlist => !playlist.favorites && !playlist.queue)
        .filter(playlist => {
            const playlistTrackIds = playlist.playlistTracks.map(playlistTrack => playlistTrack.track.id);
            return trackIds.every(trackId => playlistTrackIds.includes(trackId));
        })
        .map(playlist =>
            <option key={playlist.id} value={playlist.id} title={playlist.name}>
                {playlist.name.length > 24 ? playlist.name.substring(0, 24) : playlist.name}
            </option>
        );

    const addToPlaylistPickerForm = (
        <form>
            <div className="field has-addons">
                <div className="control">
                    <a className="button is-static is-small">
                        <span className="icon is-small">
                            <FontAwesomeIcon icon={faPlus}/>
                        </span>
                    </a>
                </div>
                <div className="control is-expanded">
                    <span className="select is-small is-fullwidth">
                        <select id={'mediaItem' + contextMenuId + 'AddToPlaylistSelect'}>
                            {addToPlaylistOptions}
                        </select>
                    </span>
                </div>
                <div className="control">
                    <a className="button is-small is-primary" onClick={(e) => addTracksToPlaylist(trackIds)} disabled={!addToPlaylistOptions.length}>
                        Ok
                    </a>
                </div>
            </div>
        </form>
    );

    const removeFromPlaylistPickerForm = (
        <form>
            <div className="field has-addons">
                <div className="control">
                    <a className="button is-static is-small">
                        <span className="icon is-small">
                            <FontAwesomeIcon icon={faMinus}/>
                        </span>
                    </a>
                </div>
                <div className="control is-expanded">
                    <span className="select is-small is-fullwidth" style={{minWidth: '8em'}}>
                        <select id={'mediaItem' + contextMenuId + 'removeFromPlaylistSelect'}>
                            {removeFromPlaylistOptions}
                        </select>
                    </span>
                </div>
                <div className="control">
                    <a className="button is-small is-primary" onClick={(e) => removeTracksFromPlaylist(trackIds)} disabled={!removeFromPlaylistOptions.length}>
                        Ok
                    </a>
                </div>
            </div>
        </form>
    );

    const button = document.getElementById(contextMenuId + 'Button');
    const left = button ? button.getBoundingClientRect().left : 0;
    const isRightAligned = (left > windowSize.width / 2) ? 'is-right' : '';

    return (
        <div className={"dropdown " + isRightAligned + (isDropdownActive ? ' is-active is-visible-important' : '')} style={props.style}>
            <div className="dropdown-trigger">
                <button className="button is-small" aria-haspopup="true" id={contextMenuId + 'Button'}
                        onClick={toggleDropdown}>
                        <span className="icon is-small">
                            <FontAwesomeIcon icon={faEllipsisH}/>
                        </span>
                </button>
            </div>
            <div className="dropdown-menu" id="dropdown-menu2" role="menu">
                <div className="dropdown-content">
                    <a className="dropdown-item" onClick={(e) => handleToggleTracksInPlaylist(favoritesPlaylist.id, trackIds, isFavorite ? 'remove' : 'add')}>
                        <p>
                            <span className={'icon has-text-success'}>
                                <FontAwesomeIcon icon={isFavorite ? fasHeart : farHeart}/>
                            </span>
                            {isFavorite ? 'Remove from ' : 'Add to '} Favorites
                        </p>
                    </a>
                    <a className="dropdown-item" onClick={(e) => handleToggleTracksInPlaylist(queuePlaylist.id, trackIds, isQueued ? 'remove' : 'add')}>
                        <p>
                            <span className={'icon ' + (isQueued ? 'has-text-success' : 'has-text-grey')}>
                                <FontAwesomeIcon icon={faList}/>
                            </span>
                            {isQueued ? 'Remove from ' : 'Add to '} Queue
                        </p>
                    </a>
                    <a className="dropdown-item" onClick={(e) => handleToggleTracksInPlaylist(queuePlaylist.id, trackIds, 'add', true)}
                       disabled={equalsQueue}>
                        <p>
                            <span className={'icon ' + (equalsQueue ? 'has-text-success' : 'has-text-grey')}>
                                <FontAwesomeIcon icon={faSync}/>
                            </span>
                            Replace Queue
                        </p>
                    </a>
                    <div className="dropdown-item">
                        {addToPlaylistPickerForm}
                    </div>
                    <div className="dropdown-item">
                        {removeFromPlaylistPickerForm}
                    </div>
                </div>
            </div>
        </div>
    );
}