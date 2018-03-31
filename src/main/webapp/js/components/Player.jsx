import React from 'react';
import PlaybackControls from "./PlaybackControls.jsx";
import $ from "jquery/dist/jquery.min";

export default class Player extends React.Component {

    constructor(props) {
        super(props);

        this.handlePlayerStateChange = this.handlePlayerStateChange.bind(this);
        this.handleTrackChange = this.handleTrackChange.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
        this.handleMuteChange = this.handleMuteChange.bind(this);
        this.handleShuffleChange = this.handleShuffleChange.bind(this);
        this.handleProgressChange = this.handleProgressChange.bind(this);

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

        this.audio = null;
        this.audioBufferSourceNode = this.audioCtx.createBufferSource;

        this.trackGainNode = this.audioCtx.createGain();
        this.trackGainNode.connect(this.audioCtx.destination);

        this.gainNode = this.audioCtx.createGain();
        this.gainNode.connect(this.trackGainNode);

        this.lastAnimationFrame = Date.now();

        this.state = {
            playerState: 'stopped',
            pausedAt: 0,
            volume: 1,
            muted: false,
            shuffle: false,
            progressPercent: 0,
            timeElapsed: Player.formatTime(Math.round(0))
        };
    }

    componentWillUpdate(nextProps, nextState)
    {
        if (nextProps.currentTrackIndex !== this.props.currentTrackIndex)
        {
            this.handlePlayerStateChange('playing', nextProps.currentTrackIndex);
        }
    }

    handlePlayerStateChange(newPlayerState, newIndex) {
        console.log('in Player.handlePlayerStateChange(' + newPlayerState + ', ' + newIndex + ')');
        const self = this;

        if (newPlayerState === 'paused')
        {
            self.setState({pausedAt: self.audio.currentTime});
            self.audio.pause();
        }
        if (newPlayerState === 'playing')
        {
            if (!newIndex && newIndex !== 0)
                newIndex = this.props.currentTrackIndex;
            if (!newIndex)
                newIndex = 0;

            let data = this.props.audioTracks[newIndex];
            console.log(data);
            this.trackGainNode.gain.setTargetAtTime(data.trackGainLinear, self.audioCtx.currentTime, 0.01);

            if (self.audio)
                self.audio.pause();

            self.audio = new Audio();
            self.audio.src = '/loon/media?id=' + data.id;
            self.audio.controls = false;
            self.audio.autoplay = false;
            document.body.appendChild(self.audio);

            self.audioBufferSourceNode = self.audioCtx.createMediaElementSource(self.audio);
            self.audioBufferSourceNode.connect(self.gainNode);

            self.audio.onended = function () {
                self.handleTrackChange('next');
            };

            this.props.onCurrentTrackIndexChange(newIndex);

            // Start updating the progress of the track.
            requestAnimationFrame(self.step.bind(self));

            self.audio.currentTime = this.state.pausedAt;
            self.audio.play();

            this.setState({pausedAt: 0});

            const thisElement = $('#track' + data.id);
            const elementTop = thisElement.offset().top;
            const elementBottom = elementTop + thisElement.outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();
            if (!(elementBottom > viewportTop && elementTop < viewportBottom))
            {
                location.href = '#track' + data.id;
                console.log(
                    'elementTop: ' + elementTop + "\n" +
                    'elementBottom: ' + elementBottom + "\n" +
                    'viewportTop: ' + viewportTop + "\n" +
                    'viewportBottom: ' + viewportBottom
                )
            }

        }
        if (newPlayerState === 'stopped')
        {
            if (self.audio) {
                self.audio.pause();
                self.audio.currentTime = 0;
            }
        }

        this.setState({playerState: newPlayerState});
    }

    handleTrackChange(input) {
        const self = this;

        // Get the next track based on the direction of the track.
        let newIndex = -1;

        if (this.state.shuffle)
        {
            newIndex = Math.floor (Math.random() * this.props.audioTracks.length);
        }
        else
        {
            if (input === 'prev') {
                newIndex = this.props.currentTrackIndex - 1;
                if (newIndex < 0) {
                    newIndex = this.props.audioTracks.length - 1;
                }
            }
            if (input === 'next') {
                newIndex = this.props.currentTrackIndex + 1;
                if (newIndex >= this.props.audioTracks.length) {
                    newIndex = 0;
                }
            }
        }

        if (newIndex === -1)
            newIndex = input;

        this.setState({pausedAt: 0}, () =>
        {
            self.handlePlayerStateChange('playing', newIndex);
            this.props.onCurrentTrackIndexChange(newIndex);

            console.log('pausedAt: ' + this.state.pausedAt);
        });
    }

    static scaleVolume(linearInput)
    {
        if (linearInput > 1) linearInput = 1;
        if (linearInput < 0) linearInput = 0;

        let scaledVolume = 3.16e-3 * Math.exp(linearInput * 5.757);
        if (linearInput === 0)
            scaledVolume = 0;

        return scaledVolume;
    }

    handleVolumeChange(volume) {
        let self = this;

        const scaledVolume = Player.scaleVolume(volume);
        this.gainNode.gain.setTargetAtTime(scaledVolume, self.audioCtx.currentTime, 0.02);

        this.setState({volume: volume});
    }

    handleMuteChange(muted) {
        if (this.state.muted)
            this.gainNode.gain.setTargetAtTime(Player.scaleVolume(this.state.volume), this.audioCtx.currentTime, 0.02);
        else
            this.gainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.02);

        this.setState({muted: !this.state.muted});
    }

    handleShuffleChange(shuffle) {
        this.setState({shuffle: !this.state.shuffle});
    }

    handleProgressChange(progress) {
        let self = this;

        // Convert the percent into a seek position.
        self.audio.currentTime = self.audio.duration * progress;

        this.setState({progress: progress});
    }

    // document.getElementById('sliderBtn').addEventListener('mousemove', move);

    static formatTime(secs) {
        const minutes = Math.floor(secs / 60) || 0;
        const seconds = (secs - minutes * 60) || 0;

        return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
    }

    scrollToTrack(index)
    {
        const element = document.getElementById('track' + index);
        const elementRect = element.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset;
        const middle = absoluteElementTop - (window.innerHeight / 2);
        window.scrollTo(0, middle);
    }


    /** The step called within requestAnimationFrame to update the playback position. */
    step() {
        let self = this;

        let elapsed = Date.now() - this.lastAnimationFrame;
        if (elapsed > 200) // update 5 times a second
        {
            // console.log(elapsed);
            // Determine our current seek position.
            let audioCurrentTime = self.audio.currentTime;
            // console.log(audioCurrentTime);
            this.setState({timeElapsed: Player.formatTime(Math.round(audioCurrentTime))});
            if (self.audio)
                this.setState({progressPercent: (((audioCurrentTime / self.audio.duration) * 100) || 0)});

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
            <div>
                <PlaybackControls
                    playerState={this.state.playerState}
                    volume={this.state.volume}
                    muted={this.state.muted}
                    shuffle={this.state.shuffle}
                    currentTrackIndex={this.props.currentTrackIndex}
                    currentTrack={this.props.audioTracks[this.props.currentTrackIndex]}
                    timeElapsed={this.state.timeElapsed}
                    progressPercent={this.state.progressPercent}
                    tracks={this.props.audioTracks}

                    onPlayerStateChange={this.handlePlayerStateChange}
                    onTrackChange={this.handleTrackChange}
                    onVolumeChange={this.handleVolumeChange}
                    onMuteChange={this.handleMuteChange}
                    onShuffleChange={this.handleShuffleChange}
                    onProgressChange={this.handleProgressChange}
                />
            </div>);
    }
}