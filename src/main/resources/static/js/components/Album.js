import React, {useContext} from 'react';
import MediaItem from "./MediaItem";
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import {AppContext} from "./AppContextProvider";
import {useMediaQuery} from "./MediaQuery";
import AlbumCard from "./AlbumCard";

export default function Album(props) {
    const artist = props.match.params.artist;
    const album = props.match.params.album;

    const appContext = useContext(AppContext);
    const maxWidth = useMediaQuery('(min-width: 768px)') ? '100%' : '500px';

    if (!appContext || !appContext.tracks)
        return <div>Loading...</div>

    const albumTracks = appContext.tracks
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