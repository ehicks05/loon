import React, {useContext, useState} from "react";
import {Link} from "react-router-dom";
import ActionMenu from "./ActionMenu";
import {AppContext} from "./AppContextProvider";
import {UserContext} from "./UserContextProvider";

export default function AlbumCard(props) {
    const [hover, setHover] = useState(false);
    const appContext = useContext(AppContext);
    const userContext = useContext(UserContext);

    function handleHoverTrue()
    {
        setHover(true);
    }

    function handleHoverFalse()
    {
        setHover(false);
    }

    const album = props.album;
    const displayArtist = album.albumArtist.length > 15 ? album.albumArtist.substring(0, 32) : album.albumArtist;
    const displayAlbum = album.album.length > 15 ? album.album.substring(0, 32) : album.album;
    const placeholder = 'https://via.placeholder.com/600x600.png?text=placeholder';
    const imageUrl = album.albumImageId ? '/art/' + album.albumImageId : placeholder;

    const contextMenuId = 'artist=' + album.albumArtist + ',album=' + album.album;
    const isContextMenuSelected = userContext.selectedContextMenuId === contextMenuId; //todo

    const showActionMenu = hover || isContextMenuSelected;
    const tracks = showActionMenu ?
        appContext.tracks.filter(track => track.albumArtist === album.albumArtist && track.album === album.album)
        : [];

    const hideAlbumArtist = props.hideAlbumArtist;

    const linkAlbumArtist = appContext.distinctArtists.includes(album.albumArtist);

    let albumArtistText = <span title={album.albumArtist}>{displayArtist}</span>;
    if (linkAlbumArtist)
        albumArtistText =
            <Link to={'/artist/' + album.albumArtist}>
                {albumArtistText}
            </Link>;

    const albumArtist = hideAlbumArtist ? null :
        <span>
            {albumArtistText}
            &nbsp;-&nbsp;
        </span>;

    return (
        <div className="card" onMouseEnter={handleHoverTrue} onMouseLeave={handleHoverFalse}>
            <div className="card-image">
                <figure className={"image is-square"}>
                    <img src={placeholder} data-src={imageUrl} alt="Placeholder image" className='lazyload'/>
                    {
                        showActionMenu &&
                        <ActionMenu tracks={tracks} contextMenuId={contextMenuId} style={{position:'absolute', top: '8px', right: '8px'}} />
                    }
                </figure>
            </div>
            <div className="card-content" style={{padding: '.75rem'}}>
                <div className="content">
                    {albumArtist}

                    <Link to={'/artist/' + album.albumArtist + '/album/' + album.album}>
                        <span title={album.albumArtist + ' - ' + album.album}>{displayAlbum}</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}