import React from 'react';
import ActionMenu from "./ActionMenu.jsx";
import {inject, observer} from "mobx-react";
import {Link} from "react-router-dom";

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

@inject('store')
@observer
export default class MediaItem extends React.Component {
    constructor(props) {
        super(props);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.handleHoverTrue = this.handleHoverTrue.bind(this);
        this.handleHoverFalse = this.handleHoverFalse.bind(this);
        this.state = {hover: false}
    }

    handleHoverTrue()
    {
        this.setState({hover: true});
    }

    handleHoverFalse()
    {
        this.setState({hover: true});
    }

    handleSelectedTrackIdChange(e, selectedPlaylistId, selectedTrackId)
    {
        console.log('handleSelectedPlaylistIdChange' + selectedPlaylistId + '...' + selectedTrackId);
        this.props.store.uiState.handleSelectedPlaylistIdChange(selectedPlaylistId, selectedTrackId);
    }

    toggleDropdown()
    {
        const el = document.getElementById('mediaItem' + this.props.track.id + 'DropDown');
        el.classList.toggle('is-active');
        el.classList.toggle('is-visible-important');
    }

    render()
    {
        const playlistId = this.props.playlistId;
        const trackId = this.props.track.id;
        const trackNumber = this.props.trackNumber;
        const artist = this.props.track.artist ? this.props.track.artist : 'Missing!';
        const trackTitle = this.props.track.title ? this.props.track.title : 'Missing!';
        const album = this.props.track.album ? this.props.track.album : 'Missing!';
        const formattedDuration = this.props.track.duration;

        const highlightClass = trackId === this.props.store.uiState.selectedTrackId ? ' playingHighlight' : '';

        const provided = this.props.provided;
        const snapshot = this.props.snapshot;

        const innerRef          = provided ? provided.innerRef : null;
        const draggableStyle    = provided ? provided.draggableProps.style : null;
        const draggableProps    = provided ? provided.draggableProps : null;
        const dragHandleProps   = provided ? provided.dragHandleProps : null;

        const isDragging = snapshot ? snapshot.isDragging : false;
        const isDropdownActive = this.props.store.uiState.selectedContextMenuTrackId === trackId;
        const isHovering = this.state.hover;

        const showActionMenu = !isDragging && (isHovering || isDropdownActive);

        return (
            <div className={highlightClass} id={'track' + trackId}
                ref={innerRef}
                {...draggableProps}
                style={getRowStyle(draggableStyle, isDragging)}
            >
                <div className={'mediaItemDiv'} onMouseEnter={this.handleHoverTrue}
                     onMouseLeave={this.handleHoverFalse}>
                    <div className={'mediaItemCounter'}>
                        {trackNumber}
                    </div>

                    <div {...dragHandleProps} className={'list-song'}>
                        <b style={{cursor: 'pointer'}} onClick={(e) => this.handleSelectedTrackIdChange(e, playlistId, trackId)}>{trackTitle}</b>
                        <br /><span style={{fontSize: '.875rem'}}><Link to={'/artist/' + artist}>{artist}</Link> - <Link to={'/artist/' + artist + '/album/' + album}><i>{album}</i></Link></span>
                    </div>

                    <div className={'mediaItemEllipsis'} style={{marginRight: '8px', flexBasis: '20px'}}>
                        {showActionMenu &&
                            <ActionMenu track={this.props.track} />
                        }
                    </div>

                    <div style={{flexBasis: '20px'}}>
                        {formatTime(formattedDuration)}
                    </div>
                </div>
            </div>);
    }
}