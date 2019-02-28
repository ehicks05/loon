import React from 'react';
import MediaItem from "./MediaItem.jsx";
import {inject, observer} from "mobx-react";
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import {AlbumCard} from "./Albums.jsx";

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

        const windowWidth = this.props.store.uiState.windowDimensions.width;
        const maxWidth = windowWidth > 768 ? '100%' : '500px';

        const mediaItems = albumTracks.map((track, index) => {
                return <MediaItem key={track.id} playlistId={0} track={track}
                                  trackNumber={track.discNumber + '.' + track.trackNumber} />
            }
        );

        return (
            <section className={'section'}>
                <div className="columns">
                    <div className="column is-one-third">
                        <div style={{maxWidth: maxWidth, margin: 'auto'}}>
                            <AlbumCard album={{albumArtist: albumTracks[0].albumArtist, album: albumTracks[0].album, albumImageId: albumTracks[0].albumImageId}} />
                        </div>
                    </div>
                    <div className="column">
                        <ul id="list" style={{display: 'flex', flexDirection: 'column', flex: '1', flexGrow: '1'}}>
                            {mediaItems}
                        </ul>
                    </div>
                </div>
            </section>
        );
    }
}