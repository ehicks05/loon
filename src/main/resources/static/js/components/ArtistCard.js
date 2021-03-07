import React, {useContext, useState} from 'react';
import ActionMenu from "./ActionMenu";
import {Link} from "react-router-dom";
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import {AppContext} from "../common/AppContextProvider";
import {UserContext} from "../common/UserContextProvider";

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
    const placeholder = `https://images.unsplash.com/photo-1609667083964-f3dbecb7e7a5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80`;
    const imageUrl = artist.artistImageId ? `https://res.cloudinary.com/ehicks/image/upload/${artist.artistImageId}` : placeholder;

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