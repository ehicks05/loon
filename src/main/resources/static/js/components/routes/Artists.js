import React, {useContext} from 'react';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import {ArtistCard} from "../ArtistCard";
import {AppContext} from "../../common/AppContextProvider";
import useWindowSize from "../../common/WindowSizeHook";

export default function Artists(props) {
    const appContext = useContext(AppContext);
    const windowSize = useWindowSize();

    const tracks = appContext.tracks;

    const artists = [...new Set(tracks.map(track => {return JSON.stringify({artistName: track.artist, artistImageId: track.artistThumbnailId})}))];

    const artistItems = artists.map((artistJson) => {
        const artist = JSON.parse(artistJson);
        return <ArtistCard key={artist.artistName} artist={artist} />
    });

    const windowWidth = windowSize.width;
    const gridItemWidth = windowWidth <= 768 ? 150 :
        windowWidth < 1024 ? 175 :
            windowWidth < 1216 ? 200 :
                windowWidth < 1408 ? 225 :
                    250;

    return (
        <div>
            <div className="title" style={{padding: '.5rem'}}>{artists.length} Artists:</div>
            <div id="playlist" className="playlist" style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{padding: '.5rem', flex: '1', flexGrow: '1'}}>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(' + gridItemWidth + 'px, 1fr))', gridGap: '.5em'}}>
                        {artistItems}
                    </div>
                </div>
            </div>
        </div>
    );
}