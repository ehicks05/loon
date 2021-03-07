import React, {useContext} from 'react';
import { FaVolumeUp, FaVolumeOff, FaRandom } from 'react-icons/fa'
import {UserContext} from "../../common/UserContextProvider";
import {useMediaQuery} from "../../common/MediaQueryHook";
import TrackProgressBar from "./TrackProgressBar";
import TrackDescription from "./TrackDescription";
import PlaybackButtons from "./PlaybackButtons";
import VolumeSlider from "./VolumeSlider";

const levelRightStyle = {marginTop: '4px', marginRight: '8px'}
const levelRightStyleMobile = {marginTop: '4px', marginRight: '0'}
const myLevel1Style = {zIndex: '5', position: 'static', padding: '8px', paddingBottom: '0'}
const myLevel2Style = {zIndex: '5', position: 'static', padding: '8px', paddingTop: '0'}

export default function PlaybackControls(props) {
    const isWidthOver768 = useMediaQuery('(min-width: 768px)');

    const playbackButtons = <PlaybackButtons playerState={props.playerState} onPlayerStateChange={props.onPlayerStateChange} />;

    const levelLeft =
        <div className="level-left">
            {isWidthOver768 && playbackButtons}
            <TrackDescription />
        </div>;

    const levelRight =
        <div className="level-right" style={isWidthOver768 ? levelRightStyle : levelRightStyleMobile}>
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

const shuffleButtonStyle = {marginLeft: '1.5em'};

function ShuffleButton() {
    const userContext = useContext(UserContext);

    function handleShuffleChange() {
        userContext.setShuffle(!userContext.user.userState.shuffle);
    }

    return (
        <a className={"button is-small" + (userContext.user.userState.shuffle ? " is-success" : "")}
           style={shuffleButtonStyle} id="shuffleBtn" onClick={handleShuffleChange}>
            <span className="icon">
                <FaRandom fixedWidth/>
            </span>
        </a>
    );
}

const muteButtonStyle = {margin:'0 .75em 0 .5em'};

function MuteButton() {
    const userContext = useContext(UserContext);

    function handleMuteChange() {
        userContext.setMuted(!userContext.user.userState.muted);
    }

    return (
        <a className="button is-small" id="muteBtn" style={muteButtonStyle} onClick={handleMuteChange}>
            <span className="icon">
                {userContext.user.userState.muted ? <FaVolumeOff fixedWidth /> : <FaVolumeUp fixedWidth />}
            </span>
        </a>
    );
}