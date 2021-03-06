import React, {useContext, useEffect, useRef, useState} from 'react';
import PlaybackControls from "./PlaybackControls";
import {UserContext} from "../../common/UserContextProvider";
import {AppContext} from "../../common/AppContextProvider";
import {VolumeContext} from "../../common/VolumeContextProvider";
import {scaleVolume, getMaxSafeGain, scrollIntoView, getMergedFrequencyBins} from "../../common/PlayerUtil";
import {TimeContext} from "../../common/TimeContextProvider";

const Player = () => {
    const userContext = useContext(UserContext);
    const userContextRef = useRef(userContext);
    const appContext = useContext(AppContext);
    const volumeContext = useContext(VolumeContext);
    const timeContext = useContext(TimeContext);

    const [playerState, setPlayerState] = useState('stopped');
    const playerStateRef = useRef(playerState);

    useEffect(() => {
        playerStateRef.current = playerState;
    }, [playerState])

    useEffect(() => {
        userContextRef.current = userContext;
    }, [userContext])

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

    useEffect(() => {
        const userState = userContextRef.current.user.userState;

        function initAudio() {
            let audio = new Audio();
            audio.controls = false;
            audio.autoplay = false;
            audio.onended = function () {handleTrackChange('next');};
            audio.ondurationchange = function () {timeContext.setDuration(audio.duration);};
            audio.onerror = function () {console.log(audio.error);};
            document.body.appendChild(audio);
            return audio;
        }
        audio.current = initAudio();

        audioCtx.current = new window.AudioContext();
        trackGainNode.current = audioCtx.current.createGain();
        gainNode.current = audioCtx.current.createGain();
        band1.current = audioCtx.current.createBiquadFilter();
        band2.current = audioCtx.current.createBiquadFilter();
        band3.current = audioCtx.current.createBiquadFilter();
        band4.current = audioCtx.current.createBiquadFilter();
        analyser.current = audioCtx.current.createAnalyser();

        gainNode.current.gain.value = scaleVolume(volumeContext.volume);
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

        scrollIntoView(userState.selectedTrackId)

        function step() {
            if (audio)
                timeContext.setElapsedTime(audio.current.currentTime);
        }
        setInterval(step, 500)

        renderSpectrumFrame(audioCtx, analyser);

        function initKeyboardShortcuts() {
            document.body.addEventListener('keyup', function(e){
                if (e.target.tagName === 'INPUT') return;

                if(e.key === ' ') handlePlayerStateChange(playerStateRef.current === 'playing' ? 'paused' : 'playing');
                if(e.key === 'ArrowRight') handleTrackChange('next');
                if(e.key === 'ArrowLeft') handleTrackChange('prev');
            });
        }
        initKeyboardShortcuts();
    }, []);

    const renders = useRef(0);

    useEffect(() => {
        if (renders.current === 0) {
            renders.current = renders.current + 1;
            return;
        }
        
        handlePlayerStateChange(null, userContextRef.current.user.userState.selectedTrackId);
    }, [userContext.user.userState.selectedTrackId]);
    useEffect(() => {
        if (gainNode.current)
            gainNode.current.gain.value = scaleVolume(volumeContext.volume);
    }, [volumeContext.volume]);

    useEffect(() => {
        if (!audio.current) return;

        const userState = userContextRef.current.user.userState;
        audio.current.muted = userState.muted;
        band1.current.frequency.value = userState.eq1Frequency;
        band1.current.gain.value = userState.eq1Gain;
        band2.current.frequency.value = userState.eq2Frequency;
        band2.current.gain.value = userState.eq2Gain;
        band3.current.frequency.value = userState.eq3Frequency;
        band3.current.gain.value = userState.eq3Gain;
        band4.current.frequency.value = userState.eq4Frequency;
        band4.current.gain.value = userState.eq4Gain;
    }, [userContext])

    // todo next 3 functions are duplicates, also found in PlaybackButtons.js
    function handleTrackChange(direction) {
        const newTrackId = getNewTrackId(direction);
        userContextRef.current.setSelectedTrackId(newTrackId);
    }

    function getCurrentPlaylistTrackIds(selectedPlaylistId) {
        const currentPlaylist = appContext.getPlaylistById(selectedPlaylistId);
        if (currentPlaylist)
            return currentPlaylist.playlistTracks.map((playlistTrack) => playlistTrack.track.id);
        else
            return appContext.tracks.map(track => track.id);
    }

    function getNewTrackId(input) {
        const selectedTrackId = userContextRef.current.user.userState.selectedTrackId
        const selectedPlaylistId = userContextRef.current.user.userState.selectedPlaylistId
        const shuffle = userContextRef.current.user.userState.shuffle;

        const currentPlaylistTrackIds = getCurrentPlaylistTrackIds(selectedPlaylistId);

        const currentTrackIndex = currentPlaylistTrackIds.indexOf(selectedTrackId);
        let newTrackId = -1;
        if (shuffle)
        {
            let newPlaylistTrackIndex = Math.floor (Math.random() * currentPlaylistTrackIds.length);
            newTrackId = currentPlaylistTrackIds[newPlaylistTrackIndex];
            console.log("new random trackId: " + newTrackId)
        }
        else
        {

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
        {
            console.error('Unable to select a new track id.')
        }

        return newTrackId;
    }

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

            timeContext.setElapsedTime(0);

            if (!newTrackId)
                newTrackId = userContextRef.current.user.userState.selectedTrackId;

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
                    .catch((e) => { console.log(e) })
            }

            scrollIntoView(track.id);
        }

        if (newPlayerState)
            setPlayerState(newPlayerState);
    }

    function handleProgressChange(progress) {
        if (audio)
            audio.current.currentTime = progress;
    }

    if (!audio)
        return <div>Loading...</div>

    return (
        <PlaybackControls
            playerState={playerState}
            onPlayerStateChange={handlePlayerStateChange}
            onProgressChange={handleProgressChange}
        />);

    function renderSpectrumFrame() {
        requestAnimationFrame(renderSpectrumFrame);

        const canvas = document.getElementById("spectrumCanvas");
        if (!canvas)
            return;

        if (!audioCtx || !analyser)
            return;

        if (audioCtx.current.state !== 'running' || playerStateRef.current !== 'playing')
            return;

        const ctx = canvas.getContext("2d");

        // Make it visually fill the positioned parent
        canvas.style.width ='100%';
        canvas.style.height='100%';
        // ...then set the internal size to match
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
        const binWidth = audioCtx.current.sampleRate / analyser.current.frequencyBinCount;
        analyser.current.getByteFrequencyData(dataArray);

        const mergedData = getMergedFrequencyBins(dataArray, binWidth);
        const bufferLength = mergedData.length;

        let x = 0;
        const barWidth = (WIDTH / bufferLength) - 1;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = mergedData[i] / (255 / HEIGHT);

            const red = (barHeight / HEIGHT) * 255;

            const r = red + (25 * (i/bufferLength));
            const g = 250 * (i/bufferLength);
            const b = 50;

            ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
            ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }
}

export default Player;