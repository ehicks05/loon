import React, {Fragment, useContext} from 'react';
import Slider, { createSliderWithTooltip } from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeOff, faRandom, faPlay, faPause, faStepForward, faStepBackward } from '@fortawesome/free-solid-svg-icons'
import {Link} from "react-router-dom";
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import {UserContext} from "./UserContextProvider";
import {useMediaQuery} from "./MediaQuery";

const SliderWithTooltip = createSliderWithTooltip(Slider);

const levelItemStyle = {marginBottom: '0'};
const timeElapsedStyle = {fontSize: '.875rem', marginRight: '10px'};
const progressStyle = {width: '100%', margin: '0'};
const durationStyle = {fontSize: '.875rem', marginLeft: '8px'};
const albumArtStyle = {height: '48px', margin: '0', paddingRight: '8px'};
// const trackStyle = {maxWidth: textWidth, maxHeight: '48px', overflow: 'auto'};
const artistAlbumTextStyle = {fontSize: '.875rem'};
const prevButtonStyle = {height: '36px', width: '36px'};
const pauseButtonStyle = {height: '45px', width: '45px'};
const nextButtonStyle = {height: '36px', width: '36px'};
const shuffleButtonStyle = {marginLeft: '1.5em'};
const muteButtonStyle = {margin:'0 .75em 0 .5em'};
const volumeSliderStyle = {width: '120px'};
const sliderTrackStyle = { backgroundColor: 'hsl(141, 71%, 48%)', height: 4 }
const sliderRailStyle = {backgroundColor: '#ddd'}
const sliderHandleStyle = {borderColor: 'hsl(141, 71%, 48%)'}

const levelRightStyle = {marginTop: '4px', marginRight: '8px'}
const myLevel1Style = {zIndex: '5', position: 'static', padding: '2px 10px 0 10px'}
const myLevel2Style = {zIndex: '5', position: 'static', padding: '6px', paddingTop: '0'}

export default function PlaybackControls(props) {
    const userContext = useContext(UserContext);
    const isWidthOver768 = useMediaQuery('(min-width: 768px)');

    function handlePlayerStateChange(e, newState) {
        console.log('handlePlayerStateChange: ' + newState);
        props.onPlayerStateChange(newState);
    }
    function handleTrackChange(e, direction) {
        console.log('handleTrackChange');
        props.onTrackChange(direction);
    }
    function handleVolumeChange(value) {
        userContext.setVolume(value);
    }
    function handleMuteChange(e) {
        userContext.setMuted(!userContext.user.userState.muted);
    }
    function handleShuffleChange(e) {
        userContext.setShuffle(!userContext.user.userState.shuffle);
    }
    function handleProgressChange(value) {
        console.log('value: ' + value);
        props.onProgressChange(value);
    }

    function formatTime(secs) {
        const minutes = Math.floor(secs / 60) || 0;
        const seconds = Math.round(secs - minutes * 60) || 0;

        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    if (!userContext || !userContext.user)
        return <div>Loading...</div>

    const userState = userContext.user.userState;
    const volume = userState.volume;
    const muted = userState.muted;
    const shuffle = userState.shuffle;

    const timeElapsed = props.timeElapsed;
    const duration = props.duration;
    const selectedTrack = props.selectedTrack;
    const artist = selectedTrack ? selectedTrack.artist : '';
    const albumArtist = selectedTrack ? selectedTrack.albumArtist : '';
    const album = selectedTrack ? selectedTrack.album : '';
    const title = selectedTrack ? selectedTrack.title : '';

    const formattedTimeElapsed = formatTime(Math.round(timeElapsed));
    const formattedDuration = formatTime(Math.round(duration));

    const textWidth = isWidthOver768 ? 'calc(100vw - 408px)' : '100%';

    const trackProgressBar =
        <div className="level-item" style={levelItemStyle}>
            <span id="timeElapsed" style={timeElapsedStyle}>{formattedTimeElapsed}</span>
            <Slider name="progress" id="progress" style={progressStyle}
                               trackStyle={sliderTrackStyle}
                               railStyle={sliderRailStyle}
                               handleStyle={sliderHandleStyle}
                               type="range" value={timeElapsed} max={duration} step={0.01} onChange={handleProgressChange}/>
            <span id="duration" style={durationStyle}>{formattedDuration}</span>
        </div>;

    const placeholder = 'https://via.placeholder.com/48x48.png?text=placeholder';
    const imageUrl = (selectedTrack && selectedTrack.albumThumbnailId) ? '/art/' + selectedTrack.albumThumbnailId : placeholder;

    // todo: does this need to be lazyload?
    const albumArt = <img src={placeholder} data-src={imageUrl} alt="Placeholder image" className='lazyload' style={albumArtStyle}/>;

    const trackDescription =
        <div className="level-item">
            {albumArt}
            <span id="track" style={{maxWidth: textWidth, maxHeight: '48px', overflow: 'auto'}}>
                <b>{title}</b>
                <br/>
                <span id='artistAlbumText' style={artistAlbumTextStyle}>
                    <Link to={'/artist/' + artist}>{artist}</Link>
                    &nbsp;-&nbsp;
                    <Link to={'/artist/' + albumArtist + '/album/' + album}><i>{album}</i></Link>
                </span>
            </span>
        </div>;

    const prevButton =
        <a className="button" id="prevBtn" style={prevButtonStyle} onClick={(e) => handleTrackChange(e, 'prev')}>
            <span className="icon">
                <FontAwesomeIcon icon={faStepBackward}/>
            </span>
        </a>;

    const playButton =
        <a className="button is-medium" id="pauseBtn" style={pauseButtonStyle}
           onClick={(e) => handlePlayerStateChange(e, props.playerState === 'playing' ? 'paused' : 'playing')}>
            <span className="icon">
                <FontAwesomeIcon icon={props.playerState === 'playing' ? faPause : faPlay}/>
            </span>
        </a>;

    const nextButton =
        <a className="button" id="nextBtn" style={nextButtonStyle} onClick={(e) => handleTrackChange(e, 'next')}>
            <span className="icon">
                <FontAwesomeIcon icon={faStepForward}/>
            </span>
        </a>;

    const playbackButtons =
        <Fragment>
            {prevButton}
            {playButton}
            {nextButton}
            {isWidthOver768 && <span style={{paddingLeft: '8px'}}> </span>}
        </Fragment>;

    const shuffleButton =
        <a className={"button is-small" + (shuffle ? " is-success" : "")} style={shuffleButtonStyle} id="shuffleBtn" onClick={handleShuffleChange}>
            <span className="icon">
                <FontAwesomeIcon icon={faRandom} fixedWidth/>
            </span>
        </a>;

    const muteButton =
        <a className="button is-small" id="muteBtn" style={muteButtonStyle} onClick={handleMuteChange}>
            <span className="icon">
                <FontAwesomeIcon icon={muted ? faVolumeOff : faVolumeUp} fixedWidth/>
            </span>
        </a>;

    const volumeSlider =
        <div style={volumeSliderStyle}>
            <SliderWithTooltip trackStyle={sliderTrackStyle}
                               railStyle={sliderRailStyle}
                               handleStyle={sliderHandleStyle}
                               value={volume} min={-30} max={0} step={1}
                               tipFormatter={v => `${v}dB`}
                               onChange={handleVolumeChange} />
        </div>;

    const levelLeft =
        <div className="level-left">
            {isWidthOver768 && playbackButtons}
            {trackDescription}
        </div>;

    const levelRight =
        <div className="level-right" style={levelRightStyle}>
            <div className="level-item">
                {!isWidthOver768 && playbackButtons}
                {shuffleButton}
                {muteButton}
                {volumeSlider}
            </div>
        </div>;

    return (
        <>
            <div className="section myLevel" style={myLevel1Style}>
                <nav className="level">
                    {trackProgressBar}
                </nav>
            </div>

            <div className="section myLevel" style={myLevel2Style}>
                <nav className="level">
                    {levelLeft}
                    {levelRight}
                </nav>
            </div>
        </>
    );
}