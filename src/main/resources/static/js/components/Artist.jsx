import React, {useContext} from 'react';
import Albums from "./Albums";
import {ArtistCard} from "./ArtistCard";
import {AppContext} from "./AppContextProvider";
import useWindowSize from "./WindowSizeHook";

export default function Artist(props) {
    const appContext = useContext(AppContext);
    const windowSize = useWindowSize();

    const artistParam = props.match.params.artist;
    const tracks = appContext.tracks;

    const artistTracks = tracks.filter(track => track.artist === artistParam);
    const artistName = artistTracks[0].artist;
    const artistImageId = artistTracks[0].artistImageId;
    const artist = {artistName: artistName, artistImageId: artistImageId};

    const maxWidth = windowSize.width > 768 ? '100%' : '500px';

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