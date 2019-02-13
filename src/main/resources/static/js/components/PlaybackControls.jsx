import React from 'react';
import 'bulma-extensions/bulma-slider/dist/js/bulma-slider.min.js'
import 'bulma-extensions/bulma-slider/dist/css/bulma-slider.min.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeOff, faRandom, faPlay, faPause, faStepForward, faStepBackward } from '@fortawesome/free-solid-svg-icons'

export default class PlaybackControls extends React.Component {
    constructor(props) {
        super(props);
        this.handlePlayerStateChange = this.handlePlayerStateChange.bind(this);
        this.handleTrackChange = this.handleTrackChange.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
        this.handleMuteChange = this.handleMuteChange.bind(this);
        this.handleShuffleChange = this.handleShuffleChange.bind(this);
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
    handleShuffleChange(e) {
        this.props.onShuffleChange(e.target.value);
    }
    handleProgressChange(e) {
        console.log('e.target.value: ' + e.target.value);
        this.props.onProgressChange(e.target.value);
    }

    static formatTime(secs) {
        const minutes = Math.floor(secs / 60) || 0;
        const seconds = (secs - minutes * 60) || 0;

        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    render()
    {
        const timeElapsed = this.props.timeElapsed;
        const duration = this.props.duration;
        const selectedTrack = this.props.selectedTrack;
        const volume = this.props.volume;
        const muted = this.props.muted;
        const shuffle = this.props.shuffle;

        const formattedTimeElapsed = PlaybackControls.formatTime(Math.round(timeElapsed));
        const formattedDuration = PlaybackControls.formatTime(Math.round(duration));

        return (
            <div>
                <div className="section myLevel" style={{zIndex: '5', position: 'static', paddingBottom: '0', paddingTop: '0'}}>
                    <nav className="level">
                        <p className="level-item" style={{marginBottom: '0'}}>
                            <span id="timer" style={{fontSize: '.875rem', marginRight: '3px'}}>{formattedTimeElapsed}</span>
                            <input name="progress" id="progress" style={{width:'100%', margin: '0'}} className="slider is-fullwidth is-small is-success"
                                   type="range" value={timeElapsed} max={duration} step={'1'} onChange={this.handleProgressChange}/>
                            <span id="duration" style={{fontSize: '.875rem', marginLeft: '3px'}}>{formattedDuration}</span>
                        </p>
                    </nav>
                </div>
                <div className="section myLevel" style={{zIndex: '5', position: 'static', paddingBottom: '6px', paddingTop: '0'}}>
                    <nav className="level">
                        <div className="level-left">
                            <p className="level-item">
                                <a className="button" id="prevBtn" onClick={(e) => this.handleTrackChange(e, 'prev')}>
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faStepBackward}/>
                                    </span>
                                </a>

                                {
                                    (this.props.playerState === 'paused' || this.props.playerState === 'stopped') ?
                                        <a className="button is-medium" id="playBtn" onClick={(e) => this.handlePlayerStateChange(e, 'playing')}>
                                            <span className="icon">
                                                <FontAwesomeIcon icon={faPlay}/>
                                            </span>
                                        </a>
                                        : ''
                                }
                                {
                                    this.props.playerState === 'playing' ?
                                        <a className="button is-medium" id="pauseBtn" onClick={(e) => this.handlePlayerStateChange(e, 'paused')}>
                                            <span className="icon">
                                                <FontAwesomeIcon icon={faPause}/>
                                            </span>
                                        </a>
                                        : ''
                                }

                                <a className="button" id="nextBtn" onClick={(e) => this.handleTrackChange(e, 'next')}>
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faStepForward}/>
                                    </span>
                                </a>
                            </p>
                            <div className="level-item">
                                <span id="track" style={{maxWidth: '400px', maxHeight: '72px', overflow: 'auto'}}>
                                    <b>{selectedTrack ? selectedTrack.title : ""}</b>
                                    <br />
                                    <span style={{fontSize: '.875rem'}}>{selectedTrack ? selectedTrack.artist : ""} - <i>{selectedTrack ? selectedTrack.album : ""}</i></span>
                                </span>
                            </div>
                        </div>

                        <div className="level-right" style={{marginTop: '4px'}}>
                            <div className="level-item">

                                <a className={"button" + (shuffle ? " is-success" : "")} id="shuffleBtn" onClick={this.handleShuffleChange}>
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faRandom} fixedWidth/>
                                    </span>
                                </a>

                                <a className="button" id="volumeBtn" style={{margin:'0 .5em'}} onClick={this.handleMuteChange}>
                                    <span className="icon">
                                        <FontAwesomeIcon icon={muted ? faVolumeOff : faVolumeUp} fixedWidth/>
                                    </span>
                                </a>
                                <input name="sliderBtn" id="sliderBtn" className="slider is-small is-success" type="range" value={volume} min="-30" max="0" step="1" onChange={this.handleVolumeChange}/>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }
}