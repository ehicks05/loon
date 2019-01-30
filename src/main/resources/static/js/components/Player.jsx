import React from 'react';
import PlaybackControls from "./PlaybackControls.jsx";
import $ from "jquery/dist/jquery.min";
import {Howl, Howler} from 'howler';

export default class Player extends React.Component {

    constructor(props) {
        super(props);

        this.handlePlayerStateChange = this.handlePlayerStateChange.bind(this);
        this.handleTrackChange = this.handleTrackChange.bind(this);
        this.handleVolumeChange = this.handleVolumeChange.bind(this);
        this.handleMuteChange = this.handleMuteChange.bind(this);
        this.handleShuffleChange = this.handleShuffleChange.bind(this);
        this.handleProgressChange = this.handleProgressChange.bind(this);

        this.lastAnimationFrame = Date.now();
        Howler.autoSuspend = false;

        this.state = {
            howl: null,
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
        if (nextProps.selectedTrackId !== this.props.selectedTrackId)
        {
            this.handlePlayerStateChange('playing', nextProps.selectedTrackId);
        }
    }

    handlePlayerStateChange(newPlayerState, newTrackId) {
        console.log('in Player.handlePlayerStateChange(' + newPlayerState + ', ' + newTrackId + ')');
        const self = this;

        if (newPlayerState === 'paused')
        {
            self.state.howl.pause();
        }
        if (newPlayerState === 'playing')
        {
            if (!newTrackId && self.state.howl && !self.state.howl.playing())
            {
                // we need to resume
                self.state.howl.play();

                // Start updating the progress of the track.
                requestAnimationFrame(self.step.bind(self));  // do this since we're exiting early

                this.setState({playerState: newPlayerState}); // do this since we're exiting early
                return;
            }

            let track = this.props.tracks.find(track => track.id === newTrackId);

            if (self.state.howl && self.state.howl.playing())
            {
                if (self.state.howl._src === '/media?id=' + track.id)
                {
                    // we need to pause
                    self.state.howl.pause();
                    this.setState({playerState: 'paused'}); // do this since we're exiting early
                    return;
                }
            }
            
            if (self.state.howl)
                self.state.howl.unload();

            self.setState({
                howl: new Howl({
                    src: '/media?id=' + track.id,
                    html5: true,
                    format: [track.path.substring(track.path.lastIndexOf('.') + 1)],
                    volume: track.trackGainLinear,
                    // pool: 0,
                    onend: function () {
                        self.handleTrackChange('next');
                    },
                    onloaderror: function (id, msg) {
                        console.log('error code: ' + msg);
                    },
                    onplayerror: function (id, msg) {
                        console.log('error code: ' + msg);
                    }
                })
            }, function () {
                self.state.howl.play();
                console.log('now playing ' + track.title);
            });

            this.props.onSelectedTrackIdChange(newTrackId);

            // Start updating the progress of the track.
            requestAnimationFrame(self.step.bind(self));

            const thisElement = $('#track' + track.id);
            if (thisElement && thisElement.offset())
            {
                const elementTop = thisElement.offset().top;
                const elementBottom = elementTop + thisElement.outerHeight();
                const viewportTop = $(window).scrollTop();
                const viewportBottom = viewportTop + $(window).height();
                if (!(elementBottom > viewportTop && elementTop < viewportBottom))
                {
                    location.href = '#track' + track.id;
                    console.log(
                        'elementTop: ' + elementTop + "\n" +
                        'elementBottom: ' + elementBottom + "\n" +
                        'viewportTop: ' + viewportTop + "\n" +
                        'viewportBottom: ' + viewportBottom
                    )
                }
            }
        }

        this.setState({playerState: newPlayerState});
    }

    handleTrackChange(input) {
        console.log('handleTrackChange');
        const self = this;

        let currentPlaylistTrackIds = [];
        const currentPlaylist = this.props.playlists.find(playlist => playlist.id === this.props.selectedPlaylistId);
        if (currentPlaylist)
            currentPlaylistTrackIds = currentPlaylist.trackIds;
        else
            currentPlaylistTrackIds = this.props.tracks.map(track => track.id);

        let newTrackId = -1;

        if (this.state.shuffle)
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

        // self.handlePlayerStateChange('playing', newTrackId);
        this.props.onSelectedTrackIdChange(newTrackId);
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

        // todo: fade
        Howler.volume(Player.scaleVolume(volume));
        self.setState({volume: volume});
    }

    handleMuteChange(muted) {
        this.state.howl.mute(!this.state.howl.mute());
        this.setState({muted: this.state.howl.mute()});
    }

    handleShuffleChange(shuffle) {
        this.setState({shuffle: !this.state.shuffle});
    }

    handleProgressChange(progress) {
        let self = this;

        // Convert the percent into a seek position.
        // self.state.howl.fade(self.state.howl.volume(), 0, 50);
        self.state.howl.seek(self.state.howl.duration() * progress);
        // self.state.howl.fade(0, self.state.howl.volume(), 50);

        this.setState({progress: progress}); // todo: this should probably be delayed or debounced
    }

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
            let audioCurrentTime = self.state.howl.seek();
            // console.log(audioCurrentTime);
            this.setState({timeElapsed: Player.formatTime(Math.round(audioCurrentTime))});
            if (self.state.howl)
                this.setState({progressPercent: (((audioCurrentTime / self.state.howl.duration()) * 100) || 0)});

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
                    selectedTrack={this.props.tracks.find(track => track.id === this.props.selectedTrackId)}
                    timeElapsed={this.state.timeElapsed}
                    progressPercent={this.state.progressPercent}

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