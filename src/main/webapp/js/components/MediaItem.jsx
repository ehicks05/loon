import React from 'react';

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

        return (
            <tr className={'list-song' + highlightClass} id={'track' + trackId} onClick={(e) => this.handleSelectedTrackIdChange(e, trackId)}>
                <td className={"has-text-right"} style={{paddingRight: '10px'}}>
                    {trackIndex + 1}.
                </td>
                <td>
                    <b>{trackTitle}</b> - {artist} - {album}
                </td>
                <td>{MediaItem.formatTime(formattedDuration)}</td>
            </tr>);
    }
}