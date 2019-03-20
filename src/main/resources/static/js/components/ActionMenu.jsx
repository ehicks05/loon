import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart as fasHeart, faList, faEllipsisH, faPlus, faMinus, faSync} from '@fortawesome/free-solid-svg-icons'
import {faHeart as farHeart} from '@fortawesome/free-regular-svg-icons'
import {inject, observer} from "mobx-react";

@inject('store')
@observer
export default class ActionMenu extends React.Component {
    constructor(props) {
        super(props);
        this.handleToggleTracksInPlaylist = this.handleToggleTracksInPlaylist.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.addTracksToPlaylist = this.addTracksToPlaylist.bind(this);
        this.removeTracksFromPlaylist = this.removeTracksFromPlaylist.bind(this);
    }

    toggleDropdown()
    {
        if (this.props.store.uiState.selectedContextMenuId === this.props.contextMenuId)
            this.props.store.uiState.selectedContextMenuId = '';
        else
            this.props.store.uiState.selectedContextMenuId = this.props.contextMenuId;
    }

    handleToggleTracksInPlaylist(playlistId, trackIds, action, replaceExisting)
    {
        const formData = new FormData();
        formData.append("trackIds", trackIds);
        formData.append("mode", action);
        formData.append("replaceExisting", replaceExisting ? replaceExisting : false);

        this.props.store.appState.toggleTracksInPlaylist(playlistId, formData);
    }

    addTracksToPlaylist(trackIds)
    {
        const playlistId = document.getElementById('mediaItem' + this.props.contextMenuId + 'AddToPlaylistSelect').value;
        this.handleToggleTracksInPlaylist(playlistId, trackIds, 'add');
    }

    removeTracksFromPlaylist(trackIds)
    {
        const playlistId = document.getElementById('mediaItem' + this.props.contextMenuId + 'removeFromPlaylistSelect').value;
        this.handleToggleTracksInPlaylist(playlistId, trackIds, 'remove');
    }

    render()
    {
        const tracks = this.props.tracks;
        const trackIds = tracks.map(track => track.id);
        const playlists = this.props.store.appState.playlists;

        const favoritesPlaylist = playlists.find(playlist => playlist.favorites);
        const favoritesIds = favoritesPlaylist.playlistTracks.map(playlistTrack => playlistTrack.track.id);
        const isFavorite = trackIds.every(trackId => favoritesIds.includes(trackId));

        const queuePlaylist = playlists.find(playlist => playlist.queue);
        const queueIds = queuePlaylist.playlistTracks.map(playlistTrack => playlistTrack.track.id);
        const isQueued = trackIds.every(trackId => queueIds.includes(trackId));
        const equalsQueue = isQueued && (trackIds.length === queueIds.length);

        const contextMenuId = this.props.contextMenuId;
        const isDropdownActive = this.props.store.uiState.selectedContextMenuId === contextMenuId;

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
                        <a className="button is-small is-primary" onClick={(e) => this.addTracksToPlaylist(trackIds)} disabled={!addToPlaylistOptions.length}>
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
                        <a className="button is-small is-primary" onClick={(e) => this.removeTracksFromPlaylist(trackIds)} disabled={!removeFromPlaylistOptions.length}>
                            Ok
                        </a>
                    </div>
                </div>
            </form>
        );

        const button = document.getElementById(contextMenuId + 'Button');
        const left = button ? button.getBoundingClientRect().left : 0;
        const isRightAligned = (left > this.props.store.uiState.windowDimensions.width / 2) ? 'is-right' : '';

        return (
            <div className={"dropdown " + isRightAligned + (isDropdownActive ? ' is-active is-visible-important' : '')} style={this.props.style}>
                <div className="dropdown-trigger">
                    <button className="button is-small" aria-haspopup="true" id={contextMenuId + 'Button'}
                            onClick={this.toggleDropdown}>
                        <span className="icon is-small">
                            <FontAwesomeIcon icon={faEllipsisH}/>
                        </span>
                    </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu2" role="menu">
                    <div className="dropdown-content">
                        <a className="dropdown-item" onClick={(e) => this.handleToggleTracksInPlaylist(favoritesPlaylist.id, trackIds, isFavorite ? 'remove' : 'add')}>
                            <p>
                                <span className={'icon has-text-success'}>
                                    <FontAwesomeIcon icon={isFavorite ? fasHeart : farHeart}/>
                                </span>
                                {isFavorite ? 'Remove from ' : 'Add to '} Favorites
                            </p>
                        </a>
                        <a className="dropdown-item" onClick={(e) => this.handleToggleTracksInPlaylist(queuePlaylist.id, trackIds, isQueued ? 'remove' : 'add')}>
                            <p>
                                <span className={'icon ' + (isQueued ? 'has-text-success' : 'has-text-grey')}>
                                    <FontAwesomeIcon icon={faList}/>
                                </span>
                                {isQueued ? 'Remove from ' : 'Add to '} Queue
                            </p>
                        </a>
                        <a className="dropdown-item" onClick={(e) => this.handleToggleTracksInPlaylist(queuePlaylist.id, trackIds, 'add', true)}
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
}