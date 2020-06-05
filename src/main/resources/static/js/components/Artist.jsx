import React from 'react';
import Albums from "./Albums";
import {inject, observer} from "mobx-react";
import {ArtistCard} from "./ArtistCard";

@inject('store')
@observer
export default class Artist extends React.Component {
    constructor(props) {
        super(props);
    }

    render()
    {
        const artistParam = this.props.match.params.artist;
        const tracks = this.props.store.appState.tracks;

        const artistTracks = tracks.filter(track => track.artist === artistParam);
        const artistName = artistTracks[0].artist;
        const artistImageId = artistTracks[0].artistImageId;
        const artist = {artistName: artistName, artistImageId: artistImageId};

        const windowWidth = this.props.store.uiState.windowDimensions.width;
        const maxWidth = windowWidth > 768 ? '100%' : '500px';

        return (
            <div>
                <section className={'section'}>
                    <div className="columns">
                        <div className="column is-one-third">
                            <div style={{maxWidth: maxWidth, margin: 'auto'}}>
                                <ArtistCard artist={artist}/>
                            </div>
                        </div>
                        <div className="column">
                            <div className="subtitle" style={{padding: '.25rem'}}>Albums</div>
                            <Albums tracks={artistTracks} hideTitle={true} hideAlbumArtist={true}/>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}