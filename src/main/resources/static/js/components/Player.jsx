import React from 'react';
import PlaybackControls from "./PlaybackControls.jsx";
import {inject, observer} from "mobx-react";

function isScrolledIntoView(el) {
    const rect = el.getBoundingClientRect();
    const elemTop = rect.top;
    const elemBottom = rect.bottom;

    // Partially visible elements return true:
    return elemTop < window.innerHeight && elemBottom >= 0;
}

@inject('store')
@observer
export default class Player extends React.Component {

    constructor(props) {
        super(props);

        this.handlePlayerStateChange = this.handlePlayerStateChange.bind(this);
        this.handleTrackChange = this.handleTrackChange.bind(this);
        this.handleProgressChange = this.handleProgressChange.bind(this);
        this.renderSpectrumFrame = this.renderSpectrumFrame.bind(this);
        this.getMergedFrequencyBins = this.getMergedFrequencyBins.bind(this);

        this.lastAnimationFrame = Date.now();

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)(); // todo: do we still need the webkit one?

        this.audio = new Audio();
        this.audio.controls = false;
        this.audio.autoplay = false;
        const self = this;
        this.audio.onended = function () {
            self.handleTrackChange('next');
        };
        this.audio.ondurationchange = function () {
            self.setState({duration: self.audio.duration});
        };
        this.audio.onerror = function () {
            console.log(self.audio.error);
        };

        document.body.appendChild(this.audio);

        this.trackGainNode = this.audioCtx.createGain();
        // this.trackGainNode.connect(this.audioCtx.destination);

        this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.value = Player.scaleVolume(this.props.store.uiState.user.userState.volume);
        this.gainNode.connect(this.trackGainNode);

        const userState = this.props.store.uiState.user.userState;
        this.band1 = this.audioCtx.createBiquadFilter();
        this.band1.type = "lowshelf";
        this.band1.frequency.value = userState.eq1Frequency;
        this.band1.gain.value = userState.eq1Gain;
        this.band2 = this.audioCtx.createBiquadFilter();
        this.band2.type = "peaking";
        this.band2.frequency.value = userState.eq2Frequency;
        this.band2.gain.value = userState.eq2Gain;
        this.band3 = this.audioCtx.createBiquadFilter();
        this.band3.type = "peaking";
        this.band3.frequency.value = userState.eq3Frequency;
        this.band3.gain.value = userState.eq3Gain;
        this.band4 = this.audioCtx.createBiquadFilter();
        this.band4.type = "highshelf";
        this.band4.frequency.value = userState.eq4Frequency;
        this.band4.gain.value = userState.eq4Gain;

        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 2048;

        this.trackGainNode.connect(this.band1);
        this.band1.connect(this.band2);
        this.band2.connect(this.band3);
        this.band3.connect(this.band4);
        this.band4.connect(this.analyser);

        this.analyser.connect(this.audioCtx.destination);

        this.audioBufferSourceNode = this.audioCtx.createMediaElementSource(this.audio);
        this.audioBufferSourceNode.connect(this.gainNode);

        this.state = {
            playerState: 'stopped',
            timeElapsed: 0,
            duration: 0
        };
    }

    componentDidMount()
    {
        Player.scrollIntoView(this.props.selectedTrackId);
    }

    componentDidUpdate(prevProps, prevState)
    {
        if (prevProps.selectedTrackId !== this.props.selectedTrackId)
        {
            this.handlePlayerStateChange('playing', this.props.selectedTrackId);
        }

        if (prevProps.volume !== this.props.volume)
        {
            this.gainNode.gain.value = Player.scaleVolume(this.props.volume);
        }
        if (prevProps.muted !== this.props.muted)
        {
            if (this.audio)
                this.audio.muted = this.props.muted;
        }
        if (prevProps.eq1Freq !== this.props.eq1Freq || prevProps.eq1Gain !== this.props.eq1Gain)
        {
            this.band1.frequency.value = this.props.eq1Freq;
            this.band1.gain.value = this.props.eq1Gain;
        }
        if (prevProps.eq2Freq !== this.props.eq2Freq || prevProps.eq2Gain !== this.props.eq2Gain)
        {
            this.band2.frequency.value = this.props.eq2Freq;
            this.band2.gain.value = this.props.eq2Gain;
        }
        if (prevProps.eq3Freq !== this.props.eq3Freq || prevProps.eq3Gain !== this.props.eq3Gain)
        {
            this.band3.frequency.value = this.props.eq3Freq;
            this.band3.gain.value = this.props.eq3Gain;
        }
        if (prevProps.eq4Freq !== this.props.eq4Freq || prevProps.eq4Gain !== this.props.eq4Gain)
        {
            this.band4.frequency.value = this.props.eq4Freq;
            this.band4.gain.value = this.props.eq4Gain;
        }
    }

    handlePlayerStateChange(newPlayerState, newTrackId) {
        console.log('in Player.handlePlayerStateChange(' + newPlayerState + ', ' + newTrackId + ')');
        const self = this;

        if (newPlayerState === 'paused')
        {
            this.audioCtx.suspend();
        }
        if (newPlayerState === 'playing')
        {
            if (!newTrackId && self.audio && self.audioCtx.state === 'suspended')
            {
                // we need to resume
                console.log('resuming from pause?');
                this.audio.play();
                this.audioCtx.resume();

                // Start updating the progress of the track.
                requestAnimationFrame(self.step.bind(self));  // do this since we're exiting early

                this.setState({playerState: newPlayerState}, function () {
                    requestAnimationFrame(self.step.bind(self)); // do this since we're exiting early
                });

                return;
            }

            this.setState({timeElapsed: 0});

            if (!newTrackId)
                newTrackId = this.props.selectedTrackId;

            let track = this.props.store.appState.tracks.find(track => track.id === newTrackId);
            if (!track)
            {
                console.log('no track found...');
                this.handleTrackChange('next');
                return;
            }
            if (track.missingFile)
            {
                console.log('attempted to play a track with missing file...');
                this.handleTrackChange('next');
                return;
            }

            if (self.audio && self.audioCtx.state === 'running')
            {
                if (self.audio.src === '/media?id=' + track.id)
                {
                    // we need to pause
                    this.audioCtx.suspend();
                    this.setState({playerState: 'paused'}); // do this since we're exiting early
                    return;
                }
            }

            self.audio.volume = 0;
            self.audio.src = '/media?id=' + track.id;
            self.trackGainNode.gain.value = track.trackGainLinear;

            const playPromise = self.audio.play();
            if (playPromise !== null) {
                playPromise.then(() => { self.audio.volume = 1; requestAnimationFrame(self.step.bind(self)); })
                    .catch(() => { self.audio.play(); })
            }

            Player.scrollIntoView(track.id);

            this.renderSpectrumFrame();
        }

        this.setState({playerState: newPlayerState});
    }

    getFrequencyTiltAdjustment(binStartingFreq) {
        let temp = binStartingFreq;
        if (temp === 0) temp = 20;

        let isAbove = temp >= 1000;
        let octavesFrom1000 = 0;
        while (true)
        {
            if (isAbove)
            {
                temp /= 2;
                if (temp < 1000)
                    break;
            }
            if (!isAbove)
            {
                temp *= 2;
                if (temp > 1000)
                    break;
            }
            octavesFrom1000++;
        }

        let dBAdjustment = (isAbove ? 1 : -1) * octavesFrom1000 * 1.1;
        let linearAdjustment = Math.pow(10, (dBAdjustment / 20));
        return linearAdjustment;
    }

    getMergedFrequencyBins() {
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        const binWidth = this.audioCtx.sampleRate / this.analyser.frequencyBinCount;
        this.analyser.getByteFrequencyData(dataArray);

        const mergedData = [];
        let i = 0;
        let size = 1;
        while (true)
        {
            let bins = Math.floor(size);

            let linearAdjustment = this.getFrequencyTiltAdjustment(i * binWidth);

            if (i === dataArray.length || i * binWidth > 22000)
                break;

            if (i + bins > dataArray.length)
                bins = dataArray.length - i;

            let slice = dataArray.slice(i, i + bins);
            let average = (array) => array.reduce((o1, o2) => o1 + o2) / array.length;
            const avg = average(slice);

            mergedData.push(avg * linearAdjustment);
            // console.log('i:' + i + '. bins:' + bins + '. db adjust:' + linearAdjustment + '. ' + (i * binWidth) + ' - ' + (i * binWidth + (bins * binWidth) - 1));
            i += bins;
            size *= 1.3;
        }

        return mergedData;
    }

    renderSpectrumFrame() {
        requestAnimationFrame(this.renderSpectrumFrame);

        const canvas = document.getElementById("spectrumCanvas");
        if (!canvas)
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

        const mergedData = this.getMergedFrequencyBins();
        const bufferLength = mergedData.length;

        // ctx.fillStyle = "#000";
        // ctx.fillRect(0, 0, WIDTH, HEIGHT);
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

    // scroll to the now-playing track (if it isn't already in view)
    static scrollIntoView(trackId)
    {
        const el = document.getElementById('track' + trackId);
        if (el && !isScrolledIntoView(el))
        {
            location.href = '#track' + trackId;
            window.scrollBy(0, -50);
        }
    }

    handleTrackChange(input) {
        console.log('handleTrackChange');
        const userState = this.props.store.uiState.user.userState;

        let currentPlaylistTrackIds = [];
        const currentPlaylist = this.props.store.appState.playlists.find(playlist => playlist.id === this.props.store.uiState.selectedPlaylistId);
        if (currentPlaylist)
        {
            currentPlaylistTrackIds = currentPlaylist.playlistTracks.map((playlistTrack) => {
                return playlistTrack.track.id;
            });
        }
        else
            currentPlaylistTrackIds = this.props.store.appState.tracks.map(track => track.id);

        let newTrackId = -1;

        if (userState.shuffle)
        {
            let newPlaylistTrackIndex = Math.floor (Math.random() * currentPlaylistTrackIds.length);
            newTrackId = currentPlaylistTrackIds[newPlaylistTrackIndex];
            console.log("new random trackId: " + newTrackId)
        }
        else
        {
            const currentTrackIndex = currentPlaylistTrackIds.indexOf(this.props.selectedTrackId);

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

        this.props.store.uiState.handleSelectedTrackIdChange(newTrackId);
    }

    static scaleVolume(dB)
    {
        if (dB > 0) dB = 0;
        if (dB < -60) dB = -60;

        let level = Math.pow(10, (dB / 20));
        if (dB === -60)
            level = 0;

        return level;
    }

    handleProgressChange(progress) {
        let self = this;

        if (self.audio)
        {
            self.audio.currentTime = progress;
            this.lastAnimationFrame = Date.now() - 1000; // force the progress bar to update
            self.step();
        }
    }

    /** The step called within requestAnimationFrame to update the playback position. */
    step() {
        let self = this;

        let elapsed = Date.now() - this.lastAnimationFrame;
        if (elapsed > 1000) // update 1 time a second
        {
            if (typeof self.audio.currentTime === 'number')
                this.setState({timeElapsed: self.audio.currentTime});

            this.lastAnimationFrame = Date.now();
        }

        // If the sound is still playing, continue stepping.
        if (this.state.playerState === 'playing') {
            requestAnimationFrame(self.step.bind(self));
        }
    }

    render()
    {
        return (
            <PlaybackControls
                    playerState={this.state.playerState}
                    selectedTrack={this.props.store.uiState.selectedTrack}
                    timeElapsed={this.state.timeElapsed}
                    duration={this.state.duration}

                    onPlayerStateChange={this.handlePlayerStateChange}
                    onTrackChange={this.handleTrackChange}
                    onProgressChange={this.handleProgressChange}
            />);
    }
}