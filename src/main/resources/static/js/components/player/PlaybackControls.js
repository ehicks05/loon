import React, {useContext} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeOff, faRandom } from '@fortawesome/free-solid-svg-icons'
import {UserContext} from "../../common/UserContextProvider";
import {useMediaQuery} from "../../common/MediaQueryHook";
import TrackProgressBar from "./TrackProgressBar";
import TrackDescription from "./TrackDescription";
import PlaybackButtons from "./PlaybackButtons";
import VolumeSlider from "./VolumeSlider";

const shuffleButtonStyle = {marginLeft: '1.5em'};
const muteButtonStyle = {margin:'0 .75em 0 .5em'};

const levelRightStyle = {marginTop: '4px', marginRight: '8px'}
const myLevel1Style = {zIndex: '5', position: 'static', padding: '2px 10px 0 10px'}
const myLevel2Style = {zIndex: '5', position: 'static', padding: '6px', paddingTop: '0'}

export default function PlaybackControls(props) {
    const isWidthOver768 = useMediaQuery('(min-width: 768px)');

    const playbackButtons = <PlaybackButtons playerState={props.playerState} onPlayerStateChange={props.onPlayerStateChange} />;

    const levelLeft =
        <div className="level-left">
            {isWidthOver768 && playbackButtons}
            <TrackDescription />
        </div>;

    const levelRight =
        <div className="level-right" style={levelRightStyle}>
            <div className="level-item">
                {!isWidthOver768 && playbackButtons}
                <ShuffleButton />
                <MuteButton />
                <VolumeSlider />
            </div>
        </div>;

    return (
        <>
            <div className="section myLevel" style={myLevel1Style}>
                <nav className="level">
                    <TrackProgressBar onProgressChange={props.onProgressChange} />
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

function ShuffleButton(props) {
    const userContext = useContext(UserContext);

    function handleShuffleChange(e) {
        userContext.setShuffle(!userContext.user.userState.shuffle);
    }

    return (
        <a className={"button is-small" + (userContext.user.userState.shuffle ? " is-success" : "")}
           style={shuffleButtonStyle} id="shuffleBtn" onClick={handleShuffleChange}>
            <span className="icon">
                <FontAwesomeIcon icon={faRandom} fixedWidth/>
            </span>
        </a>
    );
}

function MuteButton(props) {
    const userContext = useContext(UserContext);

    function handleMuteChange(e) {
        userContext.setMuted(!userContext.user.userState.muted);
    }

    return (
        <a className="button is-small" id="muteBtn" style={muteButtonStyle} onClick={handleMuteChange}>
            <span className="icon">
                <FontAwesomeIcon icon={userContext.user.userState.muted ? faVolumeOff : faVolumeUp} fixedWidth/>
            </span>
        </a>
    );
}