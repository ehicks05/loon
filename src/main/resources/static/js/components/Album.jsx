import React from 'react';
import MediaItem from "./MediaItem.jsx";

export default class Album extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedTrackIdChange = this.handleSelectedTrackIdChange.bind(this);
        this.handleCurrentPlaylistChange = this.handleCurrentPlaylistChange.bind(this);
        this.handleUpdatePlaylists = this.handleUpdatePlaylists.bind(this);

        const artist = this.props.match.params.artist;
        const album = this.props.match.params.album;
        this.state = {artist: artist, album: album};
    }

    handleCurrentPlaylistChange(newPlaylist)
    {
        this.props.onCurrentPlaylistChange(this.state.playlistId);
    }

    handleSelectedTrackIdChange(selectedTrackId)
    {
        this.props.onCurrentPlaylistChange(this.state.playlistId, selectedTrackId);
    }

    handleUpdatePlaylists()
    {
        this.props.onUpdatePlaylists();
    }

    render()
    {
        const selectedTrackId = this.props.selectedTrackId;
        const playlists = this.props.playlists;

        const favoritesPlaylist = playlists.filter(playlist => playlist.favorites)[0];
        const favoritesIds = favoritesPlaylist.playlistTracks.map(playlistTrack => playlistTrack.track.id);

        const queuePlaylist = playlists.filter(playlist => playlist.queue)[0];
        const queueIds = queuePlaylist.playlistTracks.map(playlistTrack => playlistTrack.track.id);

        const albumTracks = this.props.tracks
            .filter(track => track.albumArtist === this.state.artist && track.album === this.state.album)
            .sort((o1, o2) => {
                if (o1.discNumber === o2.discNumber)
                {
                    if (o1.trackNumber < o2.trackNumber) return -1;
                    if (o1.trackNumber > o2.trackNumber) return 1;
                    return 0;
                }
                if (o1.discNumber < o2.discNumber) return -1;
                if (o1.discNumber > o2.discNumber) return 1;
            });

        const width = 150;

        const mediaItems = albumTracks.map((track, index) => {
                return <MediaItem key={track.id} track={track} selectedTrackId={selectedTrackId}
                                  onSelectedTrackIdChange={this.handleSelectedTrackIdChange} isDraggable={false}
                                  favorite={favoritesIds.includes(track.id)} queue={queueIds.includes(track.id)}
                                  trackNumber={track.discNumber + '.' + track.trackNumber}
                />
            }
        );

        return (
            <section className={'section'} style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                <div className="title" style={{padding: '.25rem'}}>{this.state.artist + ' - ' + this.state.album}</div>
                <div className="subtitle" style={{padding: '.25rem'}}>Tracks</div>

                <ul id="list" style={{display: 'flex', flexDirection: 'column', flex: '1', flexGrow: '1'}}>
                    {mediaItems}
                </ul>
            </section>
        );
    }
}