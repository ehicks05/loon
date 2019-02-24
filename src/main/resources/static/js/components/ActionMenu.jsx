import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart as fasHeart, faList, faEllipsisH, faPlus, faMinus} from '@fortawesome/free-solid-svg-icons'
import {faHeart as farHeart} from '@fortawesome/free-regular-svg-icons'
import {inject, observer} from "mobx-react";

@inject('store')
@observer
export default class ActionMenu extends React.Component {
    constructor(props) {
        super(props);
        this.handleToggleTrackInPlaylist = this.handleToggleTrackInPlaylist.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.addTrackToPlaylist = this.addTrackToPlaylist.bind(this);
        this.removeTrackFromPlaylist = this.removeTrackFromPlaylist.bind(this);
    }

    toggleDropdown()
    {
        if (this.props.store.uiState.selectedContextMenuTrackId === this.props.track.id)
            this.props.store.uiState.selectedContextMenuTrackId = 0;
        else
            this.props.store.uiState.selectedContextMenuTrackId = this.props.track.id;
    }

    handleToggleTrackInPlaylist(playlistId, trackId)
    {
        fetch('/api/playlists/' + playlistId + '/?action=add&trackId=' + trackId, {method: 'POST'})
            .then(response => response.text()).then(responseText => {
            console.log(responseText);
            this.props.store.appState.loadPlaylists();
        });
    }

    addTrackToPlaylist(trackId)
    {
        const playlistId = document.getElementById('mediaItem' + trackId + 'AddToPlaylistSelect').value;
        this.handleToggleTrackInPlaylist(playlistId, trackId);
    }

    removeTrackFromPlaylist(trackId)
    {
        const playlistId = document.getElementById('mediaItem' + trackId + 'removeFromPlaylistSelect').value;
        this.handleToggleTrackInPlaylist(playlistId, trackId);
    }

    render()
    {
        const trackId = this.props.track.id;
        const playlists = this.props.store.appState.playlists;

        const favoritesPlaylist = playlists.find(playlist => playlist.favorites);
        const favoritesIds = favoritesPlaylist.playlistTracks.map(playlistTrack => playlistTrack.track.id);
        const isFavorite = favoritesIds.includes(trackId);

        const queuePlaylist = playlists.find(playlist => playlist.queue);
        const queueIds = queuePlaylist.playlistTracks.map(playlistTrack => playlistTrack.track.id);
        const isQueued = queueIds.includes(trackId);

        const isDropdownActive = this.props.store.uiState.selectedContextMenuTrackId === trackId;

        const addToPlaylistOptions = playlists
            .filter(playlist => !playlist.favorites && !playlist.queue)
            .filter(playlist => !playlist.playlistTracks.map(playlistTrack => playlistTrack.track.id).includes(trackId))
            .map(playlist =>
                <option key={playlist.id} value={playlist.id} title={playlist.name}>
                    {playlist.name.length > 28 ? playlist.name.substring(0, 28) : playlist.name}
                </option>
            );

        const removeFromPlaylistOptions = playlists
            .filter(playlist => !playlist.favorites && !playlist.queue)
            .filter(playlist => playlist.playlistTracks.map(playlistTrack => playlistTrack.track.id).includes(trackId))
            .map(playlist =>
                <option key={playlist.id} value={playlist.id} title={playlist.name}>
                    {playlist.name.length > 28 ? playlist.name.substring(0, 28) : playlist.name}
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
                            <select id={'mediaItem' + trackId + 'AddToPlaylistSelect'}>
                                {addToPlaylistOptions}
                            </select>
                        </span>
                    </div>
                    <div className="control">
                        <a className="button is-small is-primary" onClick={(e) => this.addTrackToPlaylist(trackId)}>
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
                        <span className="select is-small is-fullwidth" style={{minWidth: '15em'}}>
                            <select id={'mediaItem' + trackId + 'removeFromPlaylistSelect'}>
                                {removeFromPlaylistOptions}
                            </select>
                        </span>
                    </div>
                    <div className="control">
                        <a className="button is-small is-primary" onClick={(e) => this.removeTrackFromPlaylist(trackId)}>
                            Ok
                        </a>
                    </div>
                </div>
            </form>
        );

        return (
            <div className={"dropdown is-right" + (isDropdownActive ? ' is-active is-visible-important' : '')} id={'mediaItem' + trackId + 'DropDown'}>
                <div className="dropdown-trigger">
                    <button className="button is-small" aria-haspopup="true" aria-controls="dropdown-menu2"
                            onClick={this.toggleDropdown}>
                        <span className="icon is-small">
                            <FontAwesomeIcon icon={faEllipsisH}/>
                        </span>
                    </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu2" role="menu">
                    <div className="dropdown-content">
                        <a className="dropdown-item" onClick={(e) => this.handleToggleTrackInPlaylist(favoritesPlaylist.id, trackId)}>
                            <p>
                                <span className={'icon has-text-success'}>
                                    <FontAwesomeIcon icon={isFavorite ? fasHeart : farHeart}/>
                                </span>
                                {isFavorite ? 'Remove from ' : 'Add to '} favorites
                            </p>
                        </a>
                        <a className="dropdown-item" onClick={(e) => this.handleToggleTrackInPlaylist(queuePlaylist.id, trackId)}>
                            <p>
                                <span className={'icon ' + (isQueued ? 'has-text-success' : 'has-text-grey')}>
                                    <FontAwesomeIcon icon={faList}/>
                                </span>
                                {isQueued ? 'Remove from ' : 'Add to '} queue
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