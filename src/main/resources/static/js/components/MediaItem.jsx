import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from "@fortawesome/free-solid-svg-icons";

const getRowStyle = (draggableStyle, isDragging) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    filter: isDragging ? 'brightness(150%)' : '',
    // styles we need to apply on draggables
    ...draggableStyle
});

export default class MediaItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedTrackIdChange = this.handleSelectedTrackIdChange.bind(this);
    }

    handleSelectedTrackIdChange(e, selectedTrackId)
    {
        this.props.onSelectedTrackIdChange(selectedTrackId);
    }

    static formatTime(secs) {
        const minutes = Math.floor(secs / 60) || 0;
        const seconds = (secs - minutes * 60) || 0;

        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    render()
    {
        const trackId = this.props.track.id;
        const trackIndex = this.props.index;
        const artworkDbFileId = this.props.track.artworkDbFileId;
        const artist = this.props.track.artist;
        const trackTitle = this.props.track.title;
        const album = this.props.track.album;
        const formattedDuration = this.props.track.duration;

        const highlightClass = trackId === this.props.selectedTrackId ? ' playingHighlight' : '';

        const isDraggable = this.props.isDraggable;

        const provided = this.props.provided;
        const snapshot = this.props.snapshot;

        const innerRef          = provided ? provided.innerRef : null;
        const draggableStyle    = provided ? provided.draggableProps.style : null;
        const draggableProps    = provided ? provided.draggableProps : null;
        const dragHandleProps   = provided ? provided.dragHandleProps : null;

        const isDragging = snapshot ? snapshot.isDragging : false;

        return (
            <li className={highlightClass} id={'track' + trackId}
                ref={innerRef}
                {...draggableProps}
                style={getRowStyle(draggableStyle, isDragging)}
            >
                <div style={{padding: '5px', verticalAlign: 'middle', display: 'flex', flexDirection: 'horizontal', justifyContent: 'space-between'}}>

                    {isDraggable &&
                        <div style={{minWidth: '40px', flex: '.3'}}>
                            <a className="button is-small" {...dragHandleProps}>
                                <span className="icon">
                                    <FontAwesomeIcon icon={faBars}/>
                                </span>
                            </a>
                        </div>
                    }

                    <div style={{textAlign: 'right', marginRight: '5px', minWidth: '30px', flexBasis: '30px'}}>
                        {trackIndex + 1}.
                    </div>

                    <div className={'list-song'} style={{flex: '8'}}
                         onClick={(e) => this.handleSelectedTrackIdChange(e, trackId)}>
                        <b>{trackTitle}</b> - {artist} - {album}
                    </div>

                    <div style={{flexBasis: '20px'}}>
                        {MediaItem.formatTime(formattedDuration)}
                    </div>
                </div>
            </li>);
    }
}