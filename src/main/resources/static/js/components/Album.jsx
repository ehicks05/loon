import React from 'react';
import MediaItem from "./MediaItem.jsx";
import {inject, observer} from "mobx-react";

@inject('store')
@observer
export default class Album extends React.Component {
    constructor(props) {
        super(props);

        this.state = {playlistId: 0};
    }

    render()
    {
        const artist = this.props.match.params.artist;
        const album = this.props.match.params.album;

        const albumTracks = this.props.store.appState.tracks
            .filter(track => track.albumArtist === artist && track.album === album)
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
                return <MediaItem key={track.id} playlistId={0} track={track}
                                  trackNumber={track.discNumber + '.' + track.trackNumber} />
            }
        );

        return (
            <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
                <section className={'section'} style={{display: 'flex', flexDirection: 'column'}}>
                    <div className="title" style={{padding: '.25rem'}}>{artist + ' - ' + album}</div>
                    <div className="subtitle" style={{padding: '.25rem'}}>Tracks</div>
                </section>

                <ul id="list" style={{display: 'flex', flexDirection: 'column', flex: '1', flexGrow: '1'}}>
                    {mediaItems}
                </ul>
            </div>
        );
    }
}