import React, {useContext} from "react";
import {UserContext} from "../../common/UserContextProvider";
import {AppContext} from "../../common/AppContextProvider";
import {useMediaQuery} from "../../common/MediaQueryHook";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPause, faPlay, faStepBackward, faStepForward} from "@fortawesome/free-solid-svg-icons";

const prevButtonStyle = {height: '36px', width: '36px'};
const pauseButtonStyle = {height: '45px', width: '45px'};
const nextButtonStyle = {height: '36px', width: '36px'};

export default function PlaybackButtons(props) {
    const userContext = useContext(UserContext);
    const appContext = useContext(AppContext);
    const isWidthOver768 = useMediaQuery('(min-width: 768px)');

    function handlePlayerStateChange(e, newState) {
        props.onPlayerStateChange(newState);
    }

    function handleTrackChange(e, direction) {
        const newTrackId = getNewTrackId(direction);
        userContext.setSelectedTrackId(newTrackId);
    }

    function getCurrentPlaylistTrackIds() {
        const currentPlaylist = appContext.getPlaylistById(userContext.user.userState.lastPlaylistId); //todo rename
        if (currentPlaylist)
            return currentPlaylist.playlistTracks.map((playlistTrack) => playlistTrack.track.id);
        else
            return appContext.tracks.map(track => track.id);
    }

    function getNewTrackId(input) {
        const currentPlaylistTrackIds = getCurrentPlaylistTrackIds();
        let newTrackId = -1;
        const shuffle = userContext.user.userState.shuffle;
        if (shuffle)
        {
            let newPlaylistTrackIndex = Math.floor (Math.random() * currentPlaylistTrackIds.length);
            newTrackId = currentPlaylistTrackIds[newPlaylistTrackIndex];
            console.log("new random trackId: " + newTrackId)
        }
        else
        {
            const currentTrackIndex = currentPlaylistTrackIds.indexOf(userContext.user.userState.lastTrackId); //todo rename

            let newIndex;
            if (input === 'prev') {
                newIndex = currentTrackIndex - 1;
                if (newIndex < 0) {
                    newIndex = currentPlaylistTrackIds.length - 1;
                }
            }
            if (input === 'next') {
                newIndex = currentTrackIndex + 1;
                if (newIndex >= currentPlaylistTrackIds.length) {
                    newIndex = 0;
                }
            }

            newTrackId = currentPlaylistTrackIds[newIndex];
        }

        if (newTrackId === -1)
            newTrackId = input;

        return newTrackId;
    }

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

    return (
        <>
            {prevButton}
            {playButton}
            {nextButton}
            {isWidthOver768 && <span style={{paddingLeft: '8px'}}> </span>}
        </>
    );
}