import React from 'react';

export default class PlaybackControls extends React.Component {
    constructor(props) {
        super(props);
        this.handlePlayerStateChange = this.handlePlayerStateChange.bind(this);
        this.handleTrackChange = this.handleTrackChange.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
        this.handleMuteChange = this.handleMuteChange.bind(this);
        this.handleProgressChange = this.handleProgressChange.bind(this);
    }

    handlePlayerStateChange(e, newState) {
        console.log('handlePlayerStateChange: ' + newState);
        this.props.onPlayerStateChange(newState);
    }
    handleTrackChange(e, direction) {
        console.log('handleTrackChange');
        this.props.onTrackChange(direction);
    }
    handleVolumeChange(e) {
        console.log('e.target.value: ' + e.target.value);
        this.props.onVolumeChange(e.target.value);
    }
    handleMuteChange(e) {
        console.log('handleMuteChange');
        this.props.onMuteChange(e.target.value);
    }
    handleProgressChange(e) {
        console.log('e.target.value: ' + e.target.value);
        this.props.onProgressChange(e.target.value / 100);
    }

    static formatTime(secs) {
        const minutes = Math.floor(secs / 60) || 0;
        const seconds = (secs - minutes * 60) || 0;

        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    render()
    {
        const progressPercent = this.props.progressPercent;
        const timeElapsed = this.props.timeElapsed;
        const currentTrack = this.props.currentTrack;
        const volume = this.props.volume;
        const muted = this.props.muted;

        return (
            <section className="section" id="level">
                <nav className="level">
                    <div className="level-left">
                        <p className="level-item">
                            <a className="button" id="prevBtn" onClick={(e) => this.handleTrackChange(e, 'prev')}>
                                <span className="icon">
                                    <i className="fas fa-step-backward"/>
                                </span>
                            </a>

                            {
                                (this.props.playerState === 'paused' || this.props.playerState === 'stopped') ?
                                    <a className="button is-medium" id="playBtn" onClick={(e) => this.handlePlayerStateChange(e, 'playing')}>
                                        <span className="icon">
                                            <i className="fas fa-play"/>
                                        </span>
                                    </a>
                                    : ''
                            }
                            {
                                this.props.playerState === 'playing' ?
                                    <a className="button is-medium" id="pauseBtn" onClick={(e) => this.handlePlayerStateChange(e, 'paused')}>
                                        <span className="icon">
                                            <i className="fas fa-pause"/>
                                        </span>
                                    </a>
                                    : ''
                            }

                            <a className="button" id="nextBtn" onClick={(e) => this.handleTrackChange(e, 'next')}>
                                <span className="icon">
                                    <i className="fas fa-step-forward"/>
                                </span>
                            </a>
                        </p>
                        <div className="level-item">
                            <span id="timer">{timeElapsed}</span> /
                            <span id="duration">{PlaybackControls.formatTime(currentTrack.duration)}</span>
                            <span style={{width:'10px'}}/>
                            <span id="track">{currentTrack.artist} - {currentTrack.title} - {currentTrack.album}</span>
                        </div>
                    </div>

                    <div className="level-right">
                        <p className="level-item">
                            <input name="progress" id="progress" style={{width:'300px'}} className="slider is-fullwidth is-small is-success"
                                   type="range" value={progressPercent} max="100" onChange={this.handleProgressChange}/>
                        </p>

                        <div className="level-item is-hidden-mobile">
                            <a className="button is-small" id="volumeBtn" style={{marginRight:'1em', marginLeft:'3em'}} onClick={this.handleMuteChange}>
                                <span className="icon" style={muted ? {}: {display:'none'}}>
                                    <i id="volumeBtnIcon" className={"fas fa-volume-off"} />
                                </span>
                                <span className="icon" style={muted ? {display:'none'}: {}}>
                                    <i id="volumeBtnIcon2" className={"fas fa-volume-up"} />
                                </span>
                            </a>
                            <input name="sliderBtn" id="sliderBtn" className="slider is-small is-success" type="range" value={volume} max="1" step=".01" onChange={this.handleVolumeChange}/>
                        </div>
                    </div>
                </nav>
            </section>
        );
    }
}