import React from 'react';

export default class MediaItem extends React.Component {
    constructor(props) {
        super(props);
        this.handleCurrentTrackIndexChange = this.handleCurrentTrackIndexChange.bind(this);
    }

    handleCurrentTrackIndexChange(e, newIndex)
    {
        this.props.onCurrentTrackIndexChange(newIndex);
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

        const currentTrackIndex = this.props.currentTrackIndex;
        const highlightClass = currentTrackIndex === trackIndex ? ' playingHighlight' : '';

        const mediaFormat =
            (<article
                className={'media list-song' + highlightClass}
                id={'track' + trackId}
                onClick={(e) => this.handleCurrentTrackIndexChange(e, trackIndex)}
            >
                <figure className={'media-left'}>
                    <table>
                        <tbody>
                        <tr>
                            <td className={"has-text-right"} style={{paddingRight: '10px'}}>
                                {trackIndex}.
                            </td>
                            <td>
                                <figure className={"image is-48x48"}>
                                    {artworkDbFileId ?
                                        <img src={window.location.pathname + '?tab1=library&action=ajaxGetImage&dbFileId=' + artworkDbFileId}/>
                                        :
                                        <img src={'http://via.placeholder.com/48x48?text=48'}/>
                                    }
                                </figure>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </figure>
                <div className={"media-content"}>
                    <div className={"content"}>
                        <div>
                            <b>{trackTitle}</b>
                            <br/>
                            {artist} &middot; {album}
                        </div>
                    </div>
                </div>

                <div className={"media-right"}>
                    {MediaItem.formatTime(formattedDuration)}
                </div>
            </article>);

        const tableFormat = (<tr
            className={'list-song' + highlightClass}
            id={'track' + trackId}
            onClick={(e) => this.handleCurrentTrackIndexChange(e, trackIndex)}
        >
            <td className={"has-text-right"} style={{paddingRight:'10px'}}>
                {trackIndex}.
            </td>
            <td>
                <b>{trackTitle}</b> &middot; {artist} &middot; {album}
            </td>
            <td>{MediaItem.formatTime(formattedDuration)}</td>
        </tr>);

        return tableFormat;
    }
}