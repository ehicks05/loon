import React, {useContext} from 'react';
import Albums from "./Albums";
import {ArtistCard} from "../ArtistCard";
import {AppContext} from "../../common/AppContextProvider";
import useWindowSize from "../../common/WindowSizeHook";
import MediaItem from "../MediaItem";

export default function Artist(props) {
    const appContext = useContext(AppContext);
    const windowSize = useWindowSize();

    if (!appContext || !appContext.tracks)
        return <div>Loading...</div>;

    const artistParam = props.match.params.artist;

    const artistTracks = appContext.tracks
        .filter(track => track.artist === artistParam)
        .sort(sortByAlbumThenDiscNumberThenTrackNumber)
    const artistName = artistTracks[0].artist;
    const artistImageId = artistTracks[0].artistImageId;
    const artist = {artistName: artistName, artistImageId: artistImageId};

    const maxWidth = windowSize.width > 768 ? '100%' : '500px';

    const mediaItems = artistTracks.map((track) => {
            return <MediaItem key={track.id} playlistId={0} track={track}
                              trackNumber={track.discNumber + '.' + track.trackNumber} />
        }
    );

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
                        <div className="subtitle" style={{padding: '.25rem', margin: '0'}}>Albums</div>
                        <Albums tracks={artistTracks} hideTitle={true} hideAlbumArtist={true}/>

                        <div className="subtitle" style={{padding: '.25rem', margin: '.5em 0 0 0'}}>Tracks</div>
                        <ul id="list" style={{display: 'flex', flexDirection: 'column', flex: '1', flexGrow: '1'}}>
                            {mediaItems}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

function sortByAlbumThenDiscNumberThenTrackNumber(o1, o2)
{
    if (o1.album < o2.album) return -1;
    if (o1.album > o2.album) return 1;
    if (o1.discNumber < o2.discNumber) return -1;
    if (o1.discNumber > o2.discNumber) return 1;
    if (o1.trackNumber < o2.trackNumber) return -1;
    if (o1.trackNumber > o2.trackNumber) return 1;
    return 0;
}