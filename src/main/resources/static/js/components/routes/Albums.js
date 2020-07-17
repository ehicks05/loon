import React, {useContext} from 'react';
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import {AppContext} from "../../common/AppContextProvider";
import useWindowSize from "../../common/WindowSizeHook";
import AlbumCard from "../AlbumCard";

export default function Albums(props) {

    const appContext = useContext(AppContext);
    const windowSize = useWindowSize();

    let tracks = appContext.tracks;
    if (props.tracks)
        tracks = props.tracks;

    const hideTitle = props.hideTitle;
    const hideAlbumArtist = props.hideAlbumArtist;

    let albums = [...new Set(tracks.map(track => {return JSON.stringify({albumArtist: track.albumArtist, album: track.album, albumImageId: track.albumThumbnailId})}))];
    albums = albums.map(album => JSON.parse(album));
    albums = albums.sort(sortByAlbumArtistThenAlbum);

    const albumItems = albums.map((album) => {
        // const album = JSON.parse(albumJson);
        return <AlbumCard key={album.albumArtist + '-' + album.album} album={album} hideAlbumArtist={hideAlbumArtist} />
    });

    const windowWidth = windowSize.width;
    const gridItemWidth = windowWidth <= 768 ? 150 :
        windowWidth < 1024 ? 175 :
            windowWidth < 1216 ? 200 :
                windowWidth < 1408 ? 225 :
                    250;

    return (
        <div>
            {!hideTitle && <div className="title" style={{padding: '.5rem'}}>{albums.length} Albums:</div>}
            <div id="playlist" className="playlist" style={{display: 'flex', flexDirection: 'column'}}>
                <div style={{padding: '.5rem', flex: '1', flexGrow: '1'}}>
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(' + gridItemWidth + 'px, 1fr))', gridGap: '.5em'}}>
                        {albumItems}
                    </div>
                </div>
            </div>
        </div>
    );
}

function sortByAlbumArtistThenAlbum(a1, a2)
{
    if (a1.albumArtist.toLowerCase() < a2.albumArtist.toLowerCase()) return -1;
    if (a1.albumArtist.toLowerCase() > a2.albumArtist.toLowerCase()) return 1;
    if (a1.album.toLowerCase() < a2.album.toLowerCase()) return -1;
    if (a1.album.toLowerCase() > a2.album.toLowerCase()) return 1;
    return 0;
}