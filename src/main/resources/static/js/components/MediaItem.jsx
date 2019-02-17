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

    render()
    {
        const trackId = this.props.track.id;
        const trackNumber = this.props.trackNumber;
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

        const playlistOptions = this.props.playlists
            .filter(playlist => !playlist.favorites && !playlist.queue)
            .map(playlist =>
            <option key={playlist.id} value={playlist.id} title={playlist.name}>
                {playlist.name.length > 15 ? playlist.name.substring(0, 15) : playlist.name}
            </option>
        );
        
        const playlistPickerForm = (
            <form>
                <div className="field has-addons">
                    <div className="control">
                        <a className="button is-static is-small">
                            Add To:
                        </a>
                    </div>
                    <div className="control">
                        <span className="select is-small">
                            <select>
                                {playlistOptions}
                            </select>
                        </span>
                    </div>
                    <div className="control">
                        <a className="button is-small is-primary">
                            Ok
                        </a>
                    </div>
                </div>
            </form>
        );

        const dropdown = !isDragging ? (
            <div className="dropdown is-right" id={'mediaItem' + trackId + 'DropDown'}>
                <div className="dropdown-trigger">
                    <button className="button is-small" aria-haspopup="true" aria-controls="dropdown-menu2"
                            onClick={(e) => document.getElementById('mediaItem' + trackId + 'DropDown').classList.toggle('is-active')}>
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
                        <div className="dropdown-item">
                            {playlistPickerForm}
                        </div>
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
                <div className={'mediaItemDiv'}>
                    <div className={'mediaItemCounter'}>
                        {trackNumber}
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