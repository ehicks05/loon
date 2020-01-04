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

@inject('store')
@observer
export default class MediaItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleHoverTrue = this.handleHoverTrue.bind(this);
        this.handleHoverFalse = this.handleHoverFalse.bind(this);
        this.limitLength = this.limitLength.bind(this);
        this.state = {hover: false, limitTextLength: true}
    }

    handleHoverTrue()
    {
        this.setState({hover: true});
    }

    handleHoverFalse()
    {
        this.setState({hover: false});
    }

    handleSelectedTrackIdChange(e, selectedPlaylistId, selectedTrackId)
    {
        console.log('handleSelectedPlaylistIdChange' + selectedPlaylistId + '...' + selectedTrackId);
        this.props.store.uiState.handleSelectedPlaylistIdChange(selectedPlaylistId, selectedTrackId);
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
        const playlistId = this.props.playlistId;
        const trackId = this.props.track.id;
        const trackNumber = this.props.trackNumber;

        const artist = this.props.track.artist ? this.props.track.artist : 'Missing!';
        const trackTitle = this.props.track.title ? this.props.track.title : 'Missing!';
        const album = this.props.track.album ? this.props.track.album : 'Missing!';

        const trimmedArtist = this.limitLength(artist, 1.8);
        const trimmedTrackTitle = this.limitLength(trackTitle, 1);
        const trimmedAlbum = this.limitLength(album, 1.8);

        const formattedDuration = this.props.track.formattedDuration;

        const highlightClass = trackId === this.props.store.uiState.selectedTrackId ? ' playingHighlight' : '';

        const provided = this.props.provided;
        const snapshot = this.props.snapshot;

        const innerRef          = provided ? provided.innerRef : null;
        const draggableStyle    = provided ? provided.draggableProps.style : null;
        const draggableProps    = provided ? provided.draggableProps : null;
        const dragHandleProps   = provided ? provided.dragHandleProps : null;

        const contextMenuId = 'trackId=' + trackId;
        const isDropdownActive = this.props.store.uiState.selectedContextMenuId === contextMenuId;
        const isDragging = snapshot ? snapshot.isDragging : false;
        const isHovering = this.state.hover;

        const showActionMenu = !isDragging && (isHovering || isDropdownActive);

        const missingFile = this.props.track.missingFile;
        const trackTitleEl =
            <b style={{cursor: missingFile ? 'default' : 'pointer'}} onClick={missingFile ? null : (e) => this.handleSelectedTrackIdChange(e, playlistId, trackId)}>
                {trimmedTrackTitle}
            </b>;

        return (
            <div className={highlightClass} id={'track' + trackId}
                ref={innerRef}
                {...draggableProps}
                style={getRowStyle(draggableStyle, isDragging)}
            >
                <div className={'mediaItemDiv'} onMouseEnter={this.handleHoverTrue}
                     onMouseLeave={this.handleHoverFalse} style={missingFile ? {color: 'red'} : null}>
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
                            <Link to={'/artist/' + artist}>{trimmedArtist}</Link> - <Link to={'/artist/' + this.props.track.albumArtist + '/album/' + album}><i>{trimmedAlbum}</i></Link>
                        </span>
                    </div>

                    <div className={'mediaItemEllipsis'}>
                        {showActionMenu &&
                            <ActionMenu tracks={[this.props.track]} contextMenuId={contextMenuId} />
                        }
                    </div>

                    <div style={{flexBasis: '20px'}}>
                        {formattedDuration}
                    </div>
                </div>
            </div>);
    }
}