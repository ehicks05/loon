import React from 'react';
import PlaybackControls from "./PlaybackControls.jsx";
import {Howl, Howler} from 'howler';
import {inject, observer} from "mobx-react";

function isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    // var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    var isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
}

@inject('store')
@observer
export default class Player extends React.Component {

    constructor(props) {
        super(props);

        this.handlePlayerStateChange = this.handlePlayerStateChange.bind(this);
        this.handleTrackChange = this.handleTrackChange.bind(this);
        this.handleProgressChange = this.handleProgressChange.bind(this);

        this.lastAnimationFrame = Date.now();
        Howler.autoSuspend = false;

        this.state = {
            howl: null,
            playerState: 'stopped',
            timeElapsed: 0,
            duration: 0,
            firstSoundPlayed: false
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
            Howler.volume(Player.scaleVolume(this.props.volume));
        }
        if (prevProps.muted !== this.props.muted)
        {
            if (this.state.howl)
                this.state.howl.mute(this.props.muted);
        }
    }

    handlePlayerStateChange(newPlayerState, newTrackId) {
        console.log('in Player.handlePlayerStateChange(' + newPlayerState + ', ' + newTrackId + ')');
        const self = this;
        const userState = this.props.store.uiState.user.userState;

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
                return;
            }

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
                    format: [track.extension],
                    volume: track.trackGainLinear > 1 ? 1 : track.trackGainLinear,
                    mute: userState.muted,
                    // pool: 0,
                    onend: function () {
                        self.handleTrackChange('next');
                    },
                    onloaderror: function (id, msg) {
                        console.log('error code: ' + msg);
                    },
                    onplayerror: function (id, msg) {
                        console.log('error code: ' + msg);
                    },
                    onplay: function () {
                        self.setState({duration: self.state.howl.duration()});
                    }
                })
            }, function () {
                self.state.howl.play();
                if (!self.state.firstSoundPlayed)
                {
                    Howler.volume(Player.scaleVolume(userState.volume));
                    self.setState({firstSoundPlayed: true});
                }
                // self.state.howl.addFilter({
                //     filterType: 'highpass',
                //     frequency: 400.0,
                //     Q: 3.0
                // });
                // self.state.howl.addFilter({
                //     filterType: 'lowpass',
                //     frequency: 2000.0,
                //     Q: 3.0
                // });
                console.log('now playing ' + track.title);

                // Start updating the progress of the track.
                requestAnimationFrame(self.step.bind(self));
            });

            this.props.store.uiState.handleSelectedTrackIdChange(newTrackId);

            Player.scrollIntoView(track.id);
        }

        this.setState({playerState: newPlayerState});
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

        if (self.state.howl)
        {
            self.state.howl.seek(progress);
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
            if (typeof self.state.howl.seek() === 'number')
                this.setState({timeElapsed: self.state.howl.seek()});

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
                    selectedTrack={this.props.store.uiState.selectedTrack}
                    timeElapsed={this.state.timeElapsed}
                    duration={this.state.duration}

                    onPlayerStateChange={this.handlePlayerStateChange}
                    onTrackChange={this.handleTrackChange}
                    onProgressChange={this.handleProgressChange}
                />
            </div>);
    }
}