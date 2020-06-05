import React, {useContext, useState} from 'react';
import ActionMenu from "./ActionMenu";
import {Link} from "react-router-dom";
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import {AppContext} from "./AppContextProvider";
import {UserContext} from "./UserContextProvider";

export function ArtistCard(props) {
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

    const artist = props.artist;
    const placeholder = 'https://via.placeholder.com/300x300.png?text=placeholder';
    const imageUrl = artist.artistImageId ? '/art/' + artist.artistImageId : placeholder;

    const contextMenuId = 'artist=' + artist.artistName;
    const isContextMenuSelected = userContext.selectedContextMenuId === contextMenuId;

    const showActionMenu = hover || isContextMenuSelected;
    const tracks = showActionMenu ?
        appContext.tracks.filter(track => track.artist === artist.artistName)
        : [];

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
                    <Link to={'/artist/' + artist.artistName}>{artist.artistName}</Link>
                </div>
            </div>
        </div>
    );
}