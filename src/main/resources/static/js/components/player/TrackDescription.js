import {useMediaQuery} from "../../common/MediaQueryHook";
import {Link} from "react-router-dom";
import React, {useContext} from "react";
import {AppContext} from "../../common/AppContextProvider";
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import {UserContext} from "../../common/UserContextProvider";

const albumArtStyle = {height: '48px', margin: '0', paddingRight: '8px'};
// const trackStyle = {maxWidth: textWidth, maxHeight: '48px', overflow: 'auto'};
const artistAlbumTextStyle = {fontSize: '.875rem'};

export default function TrackDescription() {
    const userContext = useContext(UserContext);
    const appContext = useContext(AppContext);
    const isWidthOver768 = useMediaQuery('(min-width: 768px)');

    function getSelectedTrack() {
        return appContext.tracks && typeof appContext.tracks === 'object' ?
            appContext.getTrackById(userContext.user.userState.selectedTrackId) : null;
    }

    const selectedTrack = getSelectedTrack();

    const artist = selectedTrack ? selectedTrack.artist : '';
    const albumArtist = selectedTrack ? selectedTrack.albumArtist : '';
    const album = selectedTrack ? selectedTrack.album : '';
    const title = selectedTrack ? selectedTrack.title : '';

    const textWidth = isWidthOver768 ? 'calc(100vw - 408px)' : '100%';

    const placeholder = `https://images.unsplash.com/photo-1609667083964-f3dbecb7e7a5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=48&q=80`;
    const imageUrl = (selectedTrack && selectedTrack.albumThumbnailId) ? `https://res.cloudinary.com/ehicks/image/upload/${selectedTrack.albumThumbnailId}` : placeholder;

    // todo: does this need to be lazyload?
    const albumArt = <img src={placeholder} data-src={imageUrl} alt="Placeholder image" className='lazyload' style={albumArtStyle}/>;

    return (
        <div className="level-item">
            {albumArt}
            <span id="track" style={{maxWidth: textWidth, maxHeight: '48px', overflow: 'auto'}}>
                <b>{title}</b>
                <br/>
                <span id='artistAlbumText' style={artistAlbumTextStyle}>
                    <Link to={'/artist/' + artist}>{artist}</Link>
                    &nbsp;-&nbsp;
                    <Link to={'/artist/' + albumArtist + '/album/' + album}><i>{album}</i></Link>
                </span>
            </span>
        </div>
    );
}