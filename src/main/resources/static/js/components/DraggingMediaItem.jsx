import React from 'react';
import {inject, observer} from "mobx-react";

function formatTime(secs) {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = (secs - minutes * 60) || 0;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

@inject('store')
@observer
export default class DraggingMediaItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render()
    {
        const trackNumber = this.props.trackNumber;
        const track = this.props.track;
        const provided = this.props.provided;

        const trackId = track.id;
        const artist = track.artist ? track.artist : 'Missing!';
        const trackTitle = track.title ? track.title : 'Missing!';
        const album = track.album ? track.album : 'Missing!';
        const formattedDuration = track.duration;

        const highlightClass = trackId === this.props.store.uiState.selectedTrackId ? ' playingHighlight' : '';

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
                 style={{userSelect: "none",filter: 'brightness(150%)'}}
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
            </div>);
    }
}