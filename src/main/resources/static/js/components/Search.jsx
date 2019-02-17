import React from 'react';
import MediaItem from "./MediaItem.jsx";
import debounce from "lodash.debounce"
import TextInput from "./TextInput.jsx";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons'


export default class Search extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedTrackIdChange = this.handleSelectedTrackIdChange.bind(this);
        this.handleSearchKeyChange = this.handleSearchKeyChange.bind(this);
        this.emitChangeDebounced = debounce(this.emitChange, 250);

        this.state = {searchKey: '', activeSearchKey: ''};
    }

    handleSearchKeyChange(e)
    {
        this.setState({searchKey: e.target.value});
        this.emitChangeDebounced(e.target.value);
    }

    emitChange(value) {
        this.setState({activeSearchKey: value});
    }

    handleSelectedTrackIdChange(selectedTrackId)
    {
        this.props.onCurrentPlaylistChange(this.state.playlistId, selectedTrackId);
    }

    render()
    {
        const searchKey = this.state.activeSearchKey.toLowerCase();
        const tracks = searchKey.length > 0 ? this.props.tracks.filter(track => {
            return track.title.toLowerCase().includes(searchKey) ||
                track.artist.toLowerCase().includes(searchKey) ||
                track.albumArtist.toLowerCase().includes(searchKey) ||
                track.album.toLowerCase().includes(searchKey);
        }) : [];
        const selectedTrackId = this.props.selectedTrackId;
        const playlists = this.props.playlists;
        const favoritesPlaylist = playlists.filter(playlist => playlist.favorites)[0];
        const favoritesIds = favoritesPlaylist.playlistTracks.map(playlistTrack => playlistTrack.track.id);


        const mediaItems = tracks.map((track, index) => {
                return <MediaItem key={track.id} trackNumber={index + 1} index={index} selectedTrackId={selectedTrackId}
                                  onSelectedTrackIdChange={this.handleSelectedTrackIdChange} isDraggable={false} favorite={favoritesIds.includes(track.id)}
                                  onUpdatePlaylists={this.props.onUpdatePlaylists}/>
            }
        );

        return (
            <div>
                <form><TextInput autofocus={true} id={'searchInput'} label={'Search'} leftIcon={faSearch} value={this.state.searchKey} onChange={this.handleSearchKeyChange} horizontal={false} hideLabel={true}/></form>
                <div id="playlist" className="playlist" style={{display: 'flex', flexDirection: 'column'}}>
                    <ul id="list" style={{flex: '1', flexGrow: '1'}}>
                        {mediaItems}
                    </ul>
                </div>
            </div>
        );
    }
}