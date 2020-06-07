import React, {useContext, useState} from 'react';
import ActionMenu from "./ActionMenu";
import {Link} from "react-router-dom";
import {AppContext} from "./AppContextProvider";
import {UserContext} from "./UserContextProvider";
import useWindowSize from "./WindowSizeHook";

const getRowStyle = (draggableStyle, isDragging) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    filter: isDragging ? 'brightness(150%)' : '',
    // styles we need to apply on draggables
    ...draggableStyle
});

export default function MediaItem(props) {
    const [hover, setHover] = useState(false);
    const [limitTextLength, setLimitTextLength] = useState(true);
    const appContext = useContext(AppContext);
    const userContext = useContext(UserContext);
    const windowSize = useWindowSize();

    function handleHoverTrue()
    {
        setHover(true);
    }

    function handleHoverFalse()
    {
        setHover(false);
    }

    function handleSelectedTrackIdChange(e, selectedPlaylistId, selectedTrackId)
    {
        console.log('setSelectedPlaylistId' + selectedPlaylistId + '...' + selectedTrackId);
        userContext.setSelectedPlaylistId(selectedPlaylistId, selectedTrackId);
    }

    // not sure this is a good idea...
    function limitLength(input, fraction) {
        if (!limitTextLength)
            return input;

        const limit = ((windowSize.width * 1.6) / 20) / fraction;
        if (input.length > limit)
            return input.substring(0, limit) + '...';
        return input;
    }

    const playlistId = props.playlistId;
    const trackId = props.track.id;
    const trackNumber = props.trackNumber;

    const artist = props.track.artist ? props.track.artist : 'Missing!';
    const trackTitle = props.track.title ? props.track.title : 'Missing!';
    const album = props.track.album ? props.track.album : 'Missing!';

    const trimmedArtist = limitLength(artist, 1.8);
    const trimmedTrackTitle = limitLength(trackTitle, 1);
    const trimmedAlbum = limitLength(album, 1.8);

    const formattedDuration = props.track.formattedDuration;

    const highlightClass = trackId === userContext.user.userState.lastTrackId ? ' playingHighlight' : '';

    const provided = props.provided;
    const snapshot = props.snapshot;

    const innerRef          = provided ? provided.innerRef : null;
    const draggableStyle    = provided ? provided.draggableProps.style : null;
    const draggableProps    = provided ? provided.draggableProps : null;
    const dragHandleProps   = provided ? provided.dragHandleProps : null;

    const contextMenuId = 'trackId=' + trackId;
    const isDropdownActive = userContext.selectedContextMenuId === contextMenuId;
    const isDragging = snapshot ? snapshot.isDragging : false;

    const showActionMenu = !isDragging && (hover || isDropdownActive);

    const missingFile = props.track.missingFile;
    const trackTitleEl =
        <b style={{cursor: missingFile ? 'default' : 'pointer'}} onClick={missingFile ? null : (e) => handleSelectedTrackIdChange(e, playlistId, trackId)}>
            {trimmedTrackTitle}
        </b>;

    return (
        <div className={highlightClass} id={'track' + trackId}
             ref={innerRef}
             {...draggableProps}
             style={getRowStyle(draggableStyle, isDragging)}
        >
            <div className={'mediaItemDiv'} onMouseEnter={handleHoverTrue}
                 onMouseLeave={handleHoverFalse} style={missingFile ? {color: 'red'} : null}>
                <div className={'mediaItemCounter'}>
                    {trackNumber}
                </div>

                <div {...dragHandleProps} className={'list-song'}>
                    {trackTitleEl}
                    {missingFile &&
                    <span style={{marginLeft: '1em'}} className={"tag is-normal is-danger"}>
                                Track Missing
                            </span>
                    }
                    <br />
                    <span style={{fontSize: '.875rem'}}>
                            <Link to={'/artist/' + artist}>{trimmedArtist}</Link> - <Link to={'/artist/' + props.track.albumArtist + '/album/' + album}><i>{trimmedAlbum}</i></Link>
                        </span>
                </div>

                <div className={'mediaItemEllipsis'}>
                    {showActionMenu &&
                    <ActionMenu tracks={[props.track]} contextMenuId={contextMenuId} />
                    }
                </div>

                <div style={{flexBasis: '20px'}}>
                    {formattedDuration}
                </div>
            </div>
        </div>
    );
}