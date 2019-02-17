import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faHeart as fasHeart, faList, faListOl, faEllipsisH} from '@fortawesome/free-solid-svg-icons'
import {faHeart as farHeart} from '@fortawesome/free-regular-svg-icons'

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
        this.handleToggleFavorite = this.handleToggleFavorite.bind(this);
        this.handleToggleQueue = this.handleToggleQueue.bind(this);
        this.handleHoverTrue = this.handleHoverTrue.bind(this);
        this.handleHoverFalse = this.handleHoverFalse.bind(this);
        this.state = {hover: false}
    }

    handleSelectedTrackIdChange(e, selectedTrackId)
    {
        this.props.onSelectedTrackIdChange(selectedTrackId);
    }

    handleToggleFavorite(e, trackId)
    {
        fetch('/api/playlists/toggleFavorite?trackId=' + trackId, {method: 'POST'})
            .then(response => response.text()).then(responseText => {
            console.log(responseText);
            this.props.onUpdatePlaylists();
        });
    }

    handleToggleQueue(e, trackId)
    {
        fetch('/api/playlists/toggleQueue?trackId=' + trackId, {method: 'POST'})
            .then(response => response.text()).then(responseText => {
            console.log(responseText);
            this.props.onUpdatePlaylists();
        });
    }

    handleHoverTrue()
    {
        this.setState({hover: true});
    }

    handleHoverFalse()
    {
        this.setState({hover: true});
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
        const favorite = this.props.favorite;
        const queue = this.props.queue;

        const highlightClass = trackId === this.props.selectedTrackId ? ' playingHighlight' : '';

        const isDraggable = this.props.isDraggable;

        const provided = this.props.provided;
        const snapshot = this.props.snapshot;

        const innerRef          = provided ? provided.innerRef : null;
        const draggableStyle    = provided ? provided.draggableProps.style : null;
        const draggableProps    = provided ? provided.draggableProps : null;
        const dragHandleProps   = provided ? provided.dragHandleProps : null;

        const isDragging = snapshot ? snapshot.isDragging : false;
        const isHovering = this.state.hover;

        const dropdown = (isHovering && !isDragging) ? (
            <div className="dropdown is-hoverable is-right">
                <div className="dropdown-trigger">
                    <button className="button is-small" aria-haspopup="true" aria-controls="dropdown-menu2">
                        <span className="icon is-small">
                            <FontAwesomeIcon icon={faEllipsisH}/>
                        </span>
                    </button>
                </div>
                <div className="dropdown-menu" id="dropdown-menu2" role="menu">
                    <div className="dropdown-content">
                        <a className="dropdown-item" onClick={(e) => this.handleToggleFavorite(e, trackId)}>
                            <p>
                                <span className={'icon has-text-success'}>
                                    <FontAwesomeIcon icon={favorite ? fasHeart : farHeart}/>
                                </span>
                                {favorite ? 'Remove from ' : 'Add to '} favourites
                            </p>
                        </a>
                        <a className="dropdown-item" onClick={(e) => this.handleToggleQueue(e, trackId)}>
                            <p>
                                <span className={'icon ' + (queue ? 'has-text-success' : 'has-text-grey')}>
                                    <FontAwesomeIcon icon={faList}/>
                                </span>
                                {queue ? 'Remove from ' : 'Add to '} queue
                            </p>
                        </a>
                        <a href="#" className="dropdown-item">
                            <span className={'icon has-text-grey'}>
                                <FontAwesomeIcon icon={faListOl}/>
                            </span>
                            Add to playlist...
                        </a>
                    </div>
                </div>
            </div>
        ) : '';

        return (
            <div className={highlightClass} id={'track' + trackId}
                ref={innerRef}
                {...draggableProps}
                style={getRowStyle(draggableStyle, isDragging)}
            >
                <div className={'mediaItemDiv'}
                     onMouseEnter={this.handleHoverTrue}
                     onMouseLeave={this.handleHoverFalse}>

                    <div className={'mediaItemCounter'}>
                        {trackIndex + 1}.
                    </div>

                    <div {...dragHandleProps} style={{cursor: 'pointer'}} className={'list-song'} onClick={(e) => this.handleSelectedTrackIdChange(e, trackId)}>
                        <b>{trackTitle}</b>
                        <br /><span style={{fontSize: '.875rem'}}>{artist} - <i>{album}</i></span>
                    </div>

                    <div className={'mediaItemEllipsis'} style={{marginRight: '8px', flexBasis: '20px'}}>
                        {dropdown}
                    </div>

                    <div style={{flexBasis: '20px'}}>
                        {formatTime(formattedDuration)}
                    </div>
                </div>
            </div>);
    }
}