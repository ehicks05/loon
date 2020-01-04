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
        this.state = {limitTextLength: true}
    }

    // not sure this is a good idea...
    limitLength(input, fraction) {
        if (!this.state.limitTextLength)
            return input;

        const limit = ((this.props.store.uiState.windowDimensions.width * 1.6) / 20) / fraction;
        if (input.length > limit)
            return input.substring(0, limit) + '...';
        return input;
    }

    render()
    {
        const trackNumber = this.props.trackNumber;
        const track = this.props.track;
        const provided = this.props.provided;

        const trackId = track.id;
        const artist = this.props.track.artist ? this.limitLength(this.props.track.artist, 1.8) : 'Missing!';
        const trackTitle = this.props.track.title ? this.limitLength(this.props.track.title, 1) : 'Missing!';
        const album = this.props.track.album ? this.limitLength(this.props.track.album, 1.8) : 'Missing!';
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
            </div>);
    }
}