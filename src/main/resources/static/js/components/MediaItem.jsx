import React from 'react';

const getRowStyle = (draggableStyle, isDragging) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    filter: isDragging ? 'brightness(150%)' : '',
    // styles we need to apply on draggables
    ...draggableStyle
});

function formatTime(secs) {
    const minutes = Math.floor(secs / 60) || 0;
    const seconds = (secs - minutes * 60) || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

export default class MediaItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelectedTrackIdChange = this.handleSelectedTrackIdChange.bind(this);
    }

    handleSelectedTrackIdChange(e, selectedTrackId)
    {
        this.props.onSelectedTrackIdChange(selectedTrackId);
    }

    render()
    {
        const trackId = this.props.track.id;
        const trackIndex = this.props.index;
        const artworkDbFileId = this.props.track.artworkDbFileId;
        const artist = this.props.track.artist ? this.props.track.artist : 'Missing!';
        const trackTitle = this.props.track.title ? this.props.track.title : 'Missing!';
        const album = this.props.track.album ? this.props.track.album : 'Missing!';
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
                {...dragHandleProps}
                style={getRowStyle(draggableStyle, isDragging)}
            >
                <div className={'mediaItemDiv'}>

                    <div className={'mediaItemCounter'}>
                        {trackIndex + 1}.
                    </div>

                    <div className={'list-song'} onClick={(e) => this.handleSelectedTrackIdChange(e, trackId)}>
                        <b>{trackTitle}</b>
                        <br /><span style={{fontSize: '.875rem'}}>{artist} - <i>{album}</i></span>
                    </div>

                    <div style={{flexBasis: '20px'}}>
                        {formatTime(formattedDuration)}
                    </div>
                </div>
            </li>);
    }
}