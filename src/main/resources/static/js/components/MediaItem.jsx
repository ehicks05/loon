import React from 'react';
import ActionMenu from "./ActionMenu.jsx";

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
        this.toggleDropdown = this.toggleDropdown.bind(this);
    }

    handleSelectedTrackIdChange(e, selectedTrackId)
    {
        this.props.onSelectedTrackIdChange(selectedTrackId);
    }

    toggleDropdown()
    {
        const el = document.getElementById('mediaItem' + this.props.track.id + 'DropDown');
        el.classList.toggle('is-active');
        el.classList.toggle('is-visible-important');
    }

    render()
    {
        const trackId = this.props.track.id;
        const trackNumber = this.props.trackNumber;
        const artist = this.props.track.artist ? this.props.track.artist : 'Missing!';
        const trackTitle = this.props.track.title ? this.props.track.title : 'Missing!';
        const album = this.props.track.album ? this.props.track.album : 'Missing!';
        const formattedDuration = this.props.track.duration;
        const favorite = this.props.favorite;
        const queue = this.props.queue;

        const highlightClass = trackId === this.props.selectedTrackId ? ' playingHighlight' : '';

        const provided = this.props.provided;
        const snapshot = this.props.snapshot;

        const innerRef          = provided ? provided.innerRef : null;
        const draggableStyle    = provided ? provided.draggableProps.style : null;
        const draggableProps    = provided ? provided.draggableProps : null;
        const dragHandleProps   = provided ? provided.dragHandleProps : null;

        const isDragging = snapshot ? snapshot.isDragging : false;

        return (
            <div className={highlightClass} id={'track' + trackId}
                ref={innerRef}
                {...draggableProps}
                style={getRowStyle(draggableStyle, isDragging)}
            >
                <div className={'mediaItemDiv'}>
                    <div className={'mediaItemCounter'}>
                        {trackNumber}
                    </div>

                    <div {...dragHandleProps} style={{cursor: 'pointer'}} className={'list-song'} onClick={(e) => this.handleSelectedTrackIdChange(e, trackId)}>
                        <b>{trackTitle}</b>
                        <br /><span style={{fontSize: '.875rem'}}>{artist} - <i>{album}</i></span>
                    </div>

                    <div className={'mediaItemEllipsis'} style={{marginRight: '8px', flexBasis: '20px'}}>
                        {!isDragging &&
                            <ActionMenu onUpdatePlaylist={this.props.onUpdatePlaylists} track={this.props.track}
                                    favorite={favorite} queue={queue} playlists={this.props.playlists}/>
                        }
                    </div>

                    <div style={{flexBasis: '20px'}}>
                        {formatTime(formattedDuration)}
                    </div>
                </div>
            </div>);
    }
}