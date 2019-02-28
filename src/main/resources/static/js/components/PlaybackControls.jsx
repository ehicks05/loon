import React from 'react';
import Slider, { createSliderWithTooltip } from 'rc-slider';

import 'rc-slider/assets/index.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeOff, faRandom, faPlay, faPause, faStepForward, faStepBackward } from '@fortawesome/free-solid-svg-icons'
import {inject, observer} from "mobx-react";
import {Link} from "react-router-dom";

const SliderWithTooltip = createSliderWithTooltip(Slider);

@inject('store')
@observer
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
    handleVolumeChange(value) {
        this.props.store.uiState.updateVolume(value);
    }
    handleMuteChange(e) {
        this.props.store.uiState.updateMuted(!this.props.store.uiState.user.userState.muted);
    }
    handleShuffleChange(e) {
        this.props.store.uiState.updateShuffle(!this.props.store.uiState.user.userState.shuffle);
    }
    handleProgressChange(value) {
        console.log('value: ' + value);
        this.props.onProgressChange(value);
    }

    static formatTime(secs) {
        const minutes = Math.floor(secs / 60) || 0;
        const seconds = (secs - minutes * 60) || 0;

        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    render()
    {
        const userState = this.props.store.uiState.user.userState;
        const volume = userState.volume;
        const muted = userState.muted;
        const shuffle = userState.shuffle;

        const timeElapsed = this.props.timeElapsed;
        const duration = this.props.duration;
        const selectedTrack = this.props.selectedTrack;
        const artist = selectedTrack ? selectedTrack.artist : '';
        const albumArtist = selectedTrack ? selectedTrack.albumArtist : '';
        const album = selectedTrack ? selectedTrack.album : '';
        const title = selectedTrack ? selectedTrack.title : '';

        const formattedTimeElapsed = PlaybackControls.formatTime(Math.round(timeElapsed));
        const formattedDuration = PlaybackControls.formatTime(Math.round(duration));

        const windowWidth = this.props.store.uiState.windowDimensions.width;
        const textWidth = windowWidth > 768 ? (windowWidth - 350) + 'px' : '100%';

        return (
            <div>
                <div className="section myLevel" style={{zIndex: '5', position: 'static', padding: '2px 6px 0 6px'}}>
                    <nav className="level">
                        <div className="level-item" style={{marginBottom: '0'}}>
                            <span id="timer" style={{fontSize: '.875rem', marginRight: '8px'}}>{formattedTimeElapsed}</span>
                            <SliderWithTooltip name="progress" id="progress" style={{width:'100%', margin: '0'}}
                                    trackStyle={{ backgroundColor: 'hsl(141, 71%, 48%)', height: 4 }}
                                    railStyle={{backgroundColor: '#ddd'}}
                                    handleStyle={{borderColor: 'hsl(141, 71%, 48%)'}}
                                    tipFormatter={PlaybackControls.formatTime}
                                    type="range" value={timeElapsed} max={duration} step={1} onChange={this.handleProgressChange}/>
                            <span id="duration" style={{fontSize: '.875rem', marginLeft: '8px'}}>{formattedDuration}</span>
                        </div>
                    </nav>
                </div>
                <div className="section myLevel" style={{zIndex: '5', position: 'static', padding: '6px', paddingTop: '0'}}>
                    <nav className="level">
                        <div className="level-left">
                            <div className="level-item">
                                <span id="track" style={{maxWidth: textWidth, maxHeight: '72px', overflow: 'auto'}}>
                                    <b>{title}</b>
                                    <br />
                                    <span style={{fontSize: '.875rem'}}>
                                        <Link to={'/artist/' + artist}>{artist}</Link>
                                        &nbsp;-&nbsp;
                                        <Link to={'/artist/' + albumArtist + '/album/' + album}><i>{album}</i></Link>
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div className="level-right" style={{marginTop: '4px', marginRight: '6px'}}>
                            <div className="level-item">
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

                                <a className={"button is-small" + (shuffle ? " is-success" : "")} style={{marginLeft: '1.5em'}} id="shuffleBtn" onClick={this.handleShuffleChange}>
                                    <span className="icon">
                                        <FontAwesomeIcon icon={faRandom} fixedWidth/>
                                    </span>
                                </a>

                                <a className="button is-small" id="volumeBtn" style={{margin:'0 .75em 0 .5em'}} onClick={this.handleMuteChange}>
                                    <span className="icon">
                                        <FontAwesomeIcon icon={muted ? faVolumeOff : faVolumeUp} fixedWidth/>
                                    </span>
                                </a>
                                <div style={{width: '120px'}}>
                                    <SliderWithTooltip trackStyle={{ backgroundColor: 'hsl(141, 71%, 48%)', height: 4 }}
                                                       railStyle={{backgroundColor: '#ddd'}}
                                                       handleStyle={{borderColor: 'hsl(141, 71%, 48%)'}}
                                                       value={volume} min={-30} max={0} step={1}
                                                       tipFormatter={v => `${v}dB`}
                                                       onChange={this.handleVolumeChange} />
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        );
    }
}