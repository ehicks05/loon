import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart as fasHeart, faList, faEllipsisH} from '@fortawesome/free-solid-svg-icons'
import {faHeart as farHeart} from '@fortawesome/free-regular-svg-icons'

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
        const el = document.getElementById('mediaItem' + this.props.track.id + 'DropDown');
        el.classList.toggle('is-active');
        el.classList.toggle('is-visible-important');
    }

    handleToggleTrackInPlaylist(playlistId, trackId)
    {
        fetch('/api/playlists/' + playlistId + '/?action=add&trackId=' + trackId, {method: 'POST'})
            .then(response => response.text()).then(responseText => {
            console.log(responseText);
            this.props.onUpdatePlaylists();
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
        const favorite = this.props.favorite;
        const queue = this.props.queue;

        const queuePlaylistId = this.props.playlists.find(playlist => playlist.queue).id;
        const favoritesPlaylistId = this.props.playlists.find(playlist => playlist.favorites).id;

        const addToPlaylistOptions = this.props.playlists
            .filter(playlist => !playlist.favorites && !playlist.queue)
            .filter(playlist => !playlist.playlistTracks.map(playlistTrack => playlistTrack.track.id).includes(trackId))
            .map(playlist =>
                <option key={playlist.id} value={playlist.id} title={playlist.name}>
                    {playlist.name.length > 15 ? playlist.name.substring(0, 15) : playlist.name}
                </option>
            );

        const removeFromPlaylistOptions = this.props.playlists
            .filter(playlist => !playlist.favorites && !playlist.queue)
            .filter(playlist => playlist.playlistTracks.map(playlistTrack => playlistTrack.track.id).includes(trackId))
            .map(playlist =>
                <option key={playlist.id} value={playlist.id} title={playlist.name}>
                    {playlist.name.length > 15 ? playlist.name.substring(0, 15) : playlist.name}
                </option>
            );

        const addToPlaylistPickerForm = (
            <form>
                <div className="field has-addons">
                    <div className="control">
                        <a className="button is-static is-small">
                            Add To:
                        </a>
                    </div>
                    <div className="control">
                        <span className="select is-small">
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
                            Remove From:
                        </a>
                    </div>
                    <div className="control">
                        <span className="select is-small">
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
            <div className="dropdown is-right" id={'mediaItem' + trackId + 'DropDown'}>
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
                        <a className="dropdown-item" onClick={(e) => this.handleToggleTrackInPlaylist(favoritesPlaylistId, trackId)}>
                            <p>
                                <span className={'icon has-text-success'}>
                                    <FontAwesomeIcon icon={favorite ? fasHeart : farHeart}/>
                                </span>
                                {favorite ? 'Remove from ' : 'Add to '} favourites
                            </p>
                        </a>
                        <a className="dropdown-item" onClick={(e) => this.handleToggleTrackInPlaylist(queuePlaylistId, trackId)}>
                            <p>
                                <span className={'icon ' + (queue ? 'has-text-success' : 'has-text-grey')}>
                                    <FontAwesomeIcon icon={faList}/>
                                </span>
                                {queue ? 'Remove from ' : 'Add to '} queue
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