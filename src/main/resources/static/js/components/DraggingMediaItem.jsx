import React, {useContext, useState} from 'react';
import {UserContext} from "./UserContextProvider";
import useWindowSize from "./WindowSizeHook";

function formatTime(secs) {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = (secs - minutes * 60) || 0;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

export default function DraggingMediaItem(props) {
    const [limitTextLength, setLimitTextLength] = useState(true);
    const userContext = useContext(UserContext);
    const windowSize = useWindowSize();

    // not sure this is a good idea...
    function limitLength(input, fraction) {
        if (!limitTextLength)
            return input;

        const limit = ((windowSize.width * 1.6) / 20) / fraction;
        if (input.length > limit)
            return input.substring(0, limit) + '...';
        return input;
    }

    const trackNumber = props.trackNumber;
    const track = props.track;
    const provided = props.provided;

    const trackId = track.id;
    const artist = props.track.artist ? limitLength(props.track.artist, 1.8) : 'Missing!';
    const trackTitle = props.track.title ? limitLength(props.track.title, 1) : 'Missing!';
    const album = props.track.album ? limitLength(props.track.album, 1.8) : 'Missing!';
    const formattedDuration = track.duration;

    const highlightClass = trackId === userContext.user.userState.lastTrackId ? ' playingHighlight' : '';

    const innerRef          = provided ? provided.innerRef : null;
    const draggableProps    = provided ? provided.draggableProps : null;
    const dragHandleProps   = provided ? provided.dragHandleProps : null;

    const missingFile = track.missingFile;
    const trackTitleEl =
        <b style={{cursor: missingFile ? 'default' : 'pointer'}}>
            {trackTitle}
        </b>;

    return (
        <div className={highlightClass} id={'track' + trackId}
             ref={innerRef}
             {...draggableProps}
             style={{userSelect: "none", filter: 'brightness(130%)', boxSizing: 'border-box', border: '3px solid gray'}}
        >
            <div className={'mediaItemDiv'} style={missingFile ? {color: 'red'} : null}>
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
                            {artist} - <i>{album}</i>
                        </span>
                </div>

                <div className={'mediaItemEllipsis'}>

                </div>

                <div style={{flexBasis: '20px'}}>
                    {formatTime(formattedDuration)}
                </div>
            </div>
        </div>
    );
}