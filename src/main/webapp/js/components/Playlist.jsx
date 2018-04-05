import React from 'react';
import MediaItem from "./MediaItem.jsx";

export default class Playlist extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedTrackIdChange = this.handleSelectedTrackIdChange.bind(this);
        this.handleCurrentPlaylistChange = this.handleCurrentPlaylistChange.bind(this);

        let playlistId = this.props.match.params.id ? this.props.match.params.id : 0;
        playlistId = Number(playlistId);
        this.state = {playlistId: playlistId};
        console.log(this.state.playlistId);
    }

    handleCurrentPlaylistChange(newPlaylist)
    {
        this.props.onCurrentPlaylistChange(this.state.playlistId);
    }

    handleSelectedTrackIdChange(selectedTrackId)
    {
        this.props.onCurrentPlaylistChange(this.state.playlistId, selectedTrackId);
    }

    render()
    {
        const tracks = this.props.tracks;
        const selectedTrackId = this.props.selectedTrackId;
        const playlists = this.props.playlists;

        const routeParamPlaylistId = this.state.playlistId;

        let mediaItems;
        const playlist = playlists.find(playlist => playlist.id === routeParamPlaylistId);
        console.log(playlist);
        if (playlist)
        {
            mediaItems = playlist.trackIds.map((trackId, index) => {
                    const track = tracks.find(track => track.id === trackId);
                    return <MediaItem key={track.id} track={track} index={index} selectedTrackId={selectedTrackId} onSelectedTrackIdChange={this.handleSelectedTrackIdChange}/>
                }
            );
        }
        else
        {
            mediaItems = tracks.map((track, index) => {
                    return <MediaItem key={track.id} track={track} index={index} selectedTrackId={selectedTrackId} onSelectedTrackIdChange={this.handleSelectedTrackIdChange}/>
                }
            );
        }

        return (
            <div>
                <section className={"section"}>
                    <div className="container">
                        <h1 className="title">Library</h1>
                    </div>
                </section>

                <section className="section" id="root">
                    <div className="columns is-multiline is-centered">
                        <div className="column is-four-fifths">

                            <div id="playlist" className="playlist">
                                <table className={'table is-fullwidth is-hoverable is-narrow is-striped'} id="list">
                                    <tbody>
                                        {mediaItems}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Prevents the PlaybackControls from covering up the last few tracks. */}
                    <div style={{height: '150px'}} />
                </section>
            </div>);
    }
}