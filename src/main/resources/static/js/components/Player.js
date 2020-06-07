import React, {useContext, useEffect, useRef, useState} from 'react';
import PlaybackControls from "./PlaybackControls";
import {UserContext} from "./UserContextProvider";
import {AppContext} from "./AppContextProvider";
import {scaleVolume, getMaxSafeGain, scrollIntoView} from "./PlayerUtil";

export default function Player(props) {
    const userContext = useContext(UserContext);
    const appContext = useContext(AppContext);

    const [playerState, setPlayerState] = useState('stopped');
    const [duration, setDuration] = useState(0);
    const [timeElapsed, setTimeElapsed] = useState(0);

    let audio = useRef({});
    let audioCtx = useRef({});
    let trackGainNode = useRef({});
    let gainNode = useRef({});
    let band1 = useRef({});
    let band2 = useRef({});
    let band3 = useRef({});
    let band4 = useRef({});
    let analyser = useRef({});
    let audioBufferSourceNode = useRef({});

    function initAudio() {
        let audio = new Audio();
        audio.controls = false;
        audio.autoplay = false;
        audio.onended = function () {handleTrackChange('next');};
        audio.ondurationchange = function () {setDuration(audio.duration);};
        audio.onerror = function () {console.log(audio.error);};
        document.body.appendChild(audio);
        return audio;
    }

    useEffect(() => {
        const userState = userContext.user.userState;

        audio.current = initAudio();

        audioCtx.current = new window.AudioContext();
        trackGainNode.current = audioCtx.current.createGain();
        gainNode.current = audioCtx.current.createGain();
        band1.current = audioCtx.current.createBiquadFilter();
        band2.current = audioCtx.current.createBiquadFilter();
        band3.current = audioCtx.current.createBiquadFilter();
        band4.current = audioCtx.current.createBiquadFilter();
        analyser.current = audioCtx.current.createAnalyser();

        gainNode.current.gain.value = scaleVolume(userState.volume);
        gainNode.current.connect(trackGainNode.current);

        band1.current.type = "lowshelf";
        band1.current.frequency.value = userState.eq1Frequency;
        band1.current.gain.value = userState.eq1Gain;
        band2.current.type = "peaking";
        band2.current.frequency.value = userState.eq2Frequency;
        band2.current.gain.value = userState.eq2Gain;
        band3.current.type = "peaking";
        band3.current.frequency.value = userState.eq3Frequency;
        band3.current.gain.value = userState.eq3Gain;
        band4.current.type = "highshelf";
        band4.current.frequency.value = userState.eq4Frequency;
        band4.current.gain.value = userState.eq4Gain;

        analyser.current.fftSize = 4096;

        trackGainNode.current.connect(band1.current);
        band1.current.connect(band2.current);
        band2.current.connect(band3.current);
        band3.current.connect(band4.current);
        band4.current.connect(analyser.current);

        analyser.current.connect(audioCtx.current.destination);

        audioBufferSourceNode.current = audioCtx.current.createMediaElementSource(audio.current);
        audioBufferSourceNode.current.connect(gainNode.current);

        scrollIntoView(userState.lastTrackId) //todo rename

        setInterval(step, 200)
    }, []);

    useEffect(() => {
        handlePlayerStateChange(null, userContext.user.userState.lastTrackId);
    }, [userContext.user.userState.lastTrackId]);
    useEffect(() => {
        if (gainNode.current)
            gainNode.current.gain.value = scaleVolume(userContext.user.userState.volume);
    }, [userContext.user.userState.volume]);
    useEffect(() => {
        if (audio.current)
            audio.current.muted = userContext.user.userState.muted;
    }, [userContext.user.userState.muted]);
    useEffect(() => {
        if (!band1.current)
            return;
        band1.current.frequency.value = userContext.user.userState.eq1Frequency;
        band1.current.gain.value = userContext.user.userState.eq1Gain;
    }, [userContext.user.userState.eq1Frequency, userContext.user.userState.eq1Gain]);
    useEffect(() => {
        if (!band2.current)
            return;
        band2.current.frequency.value = userContext.user.userState.eq2Frequency;
        band2.current.gain.value = userContext.user.userState.eq2Gain;
    }, [userContext.user.userState.eq2Frequency, userContext.user.userState.eq2Gain]);
    useEffect(() => {
        if (!band3.current)
            return;
        band3.current.frequency.value = userContext.user.userState.eq3Frequency;
        band3.current.gain.value = userContext.user.userState.eq3Gain;
    }, [userContext.user.userState.eq3Frequency, userContext.user.userState.eq3Gain]);
    useEffect(() => {
        if (!band4.current)
            return;
        band4.current.frequency.value = userContext.user.userState.eq4Frequency;
        band4.current.gain.value = userContext.user.userState.eq4Gain;
    }, [userContext.user.userState.eq4Frequency, userContext.user.userState.eq4Gain]);

    function getSelectedTrack() {
        return appContext.tracks && typeof appContext.tracks === 'object' ?
            appContext.tracks.find(track => track.id === userContext.user.userState.lastTrackId) : null; // todo rename lastTrackId
    }

    const selectedTrack = getSelectedTrack();

    function handlePlayerStateChange(newPlayerState, newTrackId) {
        console.log('in Player.handlePlayerStateChange(' + newPlayerState + ', ' + newTrackId + ')');

        if (newPlayerState === 'paused')
            audioCtx.current.suspend();
        if (newPlayerState === 'playing' || !newPlayerState)
        {
            // resume
            if (!newTrackId && audio.current.currentSrc && audioCtx.current.state === 'suspended')
            {
                audio.current.play();
                audioCtx.current.resume();
                setPlayerState(newPlayerState)

                return;
            }

            // resume if suspended because of Autoplay Policy
            if (newPlayerState === 'playing' && audioCtx.current.state === 'suspended')
                audioCtx.current.resume();

            setTimeElapsed(0);

            if (!newTrackId)
                newTrackId = userContext.user.userState.lastTrackId;

            let track = appContext.tracks.find(track => track.id === newTrackId);
            if (!track)
            {
                console.log('no track found...');
                handleTrackChange('next');
                return;
            }
            if (track.missingFile)
            {
                console.log('attempted to play a track with missing file...');
                handleTrackChange('next');
                return;
            }

            if (audio.current && audioCtx.current.state === 'running')
            {
                if (audio.current.src === '/media?id=' + track.id)
                {
                    // we need to pause
                    audioCtx.current.suspend();
                    setPlayerState('paused'); // do this since we're exiting early
                    return;
                }
            }

            if (audio.current) {
                audio.current.volume = 0;
                audio.current.src = '/media?id=' + track.id;
            }
            if (trackGainNode.current)
                trackGainNode.current.gain.value = getMaxSafeGain(track.trackGainLinear, track.trackPeak);

            const playPromise = audio.current ? audio.current.play() : null;
            if (playPromise !== null) {
                playPromise
                    .then(() => {
                        audio.current.volume = 1;

                        // This triggers when we hit 'next track' button while playback is paused.
                        // The player will go to start playing the new track and immediately pause.
                        if (!newPlayerState && (playerState === 'paused' || playerState === 'stopped'))
                        {
                            audioCtx.current.suspend();
                        }
                    })
                    .catch(() => { audio.current.play(); })
            }

            scrollIntoView(track.id);
        }

        if (newPlayerState)
            setPlayerState(newPlayerState);
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

    function handleTrackChange(input) {
        const newTrackId = getNewTrackId(input);

        userContext.setSelectedTrackId(newTrackId);
    }

    function handleProgressChange(progress) {
        if (audio)
        {
            audio.current.currentTime = progress;
            step();
        }
    }

    function step() {
        if (audio)
            setTimeElapsed(audio.current.currentTime);
    }

    if (!audio)
        return <div>Loading...</div>

    return (
        <PlaybackControls
            playerState={playerState}
            selectedTrack={selectedTrack}
            timeElapsed={timeElapsed}
            duration={duration}

            onPlayerStateChange={handlePlayerStateChange}
            onTrackChange={handleTrackChange}
            onProgressChange={handleProgressChange}
        />);
}