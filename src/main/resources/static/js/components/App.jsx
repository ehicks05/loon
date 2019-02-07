import React from 'react';
import {Redirect, Route, Router, Switch} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import 'bulma-extensions/bulma-pageloader/dist/css/bulma-pageloader.min.css'

import Header from "./Header.jsx";
import Player from "./Player.jsx";
import MyHelmet from "./MyHelmet.jsx";
import SystemSettings from "./SystemSettings.jsx";
import Playlist from "./Playlist.jsx";
import Playlists from "./Playlists.jsx";
import Eq from "./Eq.jsx";
// import PlaylistBuilder from "./PlaylistBuilder.jsx";

import Loadable from "react-loadable";
import SidePanel from "./SidePanel.jsx";
import UserSettings from "./UserSettings.jsx";
import Artists from "./Artists.jsx";
import Albums from "./Albums.jsx";

function Loading() {
    return <div>Loading...</div>;
}

const LoadablePlaylistBuilder = Loadable({
    loader: () => import("./PlaylistBuilder.jsx"),
    loading: Loading
});

export default class App extends React.Component {

    constructor(props) {
        super(props);
        let self = this;

        this.handleCurrentPlaylistChange = this.handleCurrentPlaylistChange.bind(this);
        this.handleSelectedTrackIdChange = this.handleSelectedTrackIdChange.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);
        this.reloadPlaylists = this.reloadPlaylists.bind(this);
        this.reloadTracks = this.reloadTracks.bind(this);
        this.reloadUser = this.reloadUser.bind(this);
        this.reloadTheme = this.reloadTheme.bind(this);

        const basename = '/';
        const history = createBrowserHistory({ basename });
        self.state = {history: history};

        self.state.user = {};
        self.state.themeLoaded = false;
        self.state.dataLoaded = false;
    }

    handleCurrentPlaylistChange(selectedPlaylistId, selectedTrackId)
    {
        this.setState({selectedPlaylistId: selectedPlaylistId, selectedTrackId: selectedTrackId});
    }

    handleSelectedTrackIdChange(selectedTrackId)
    {
        const self = this;
        this.setState({selectedTrackId: selectedTrackId}, () => {
            const formData = new FormData();
            formData.append('lastPlaylistId', this.state.selectedPlaylistId);
            formData.append('lastTrackId', this.state.selectedTrackId);
            fetch('/api/users/' + self.state.user.id + '/saveProgress', {method: 'PUT', body: formData})
                .then(response => response.json());
        });
    }

    handleThemeChange(newTheme)
    {
        this.reloadTheme();
    }

    reloadPlaylists()
    {
        const self = this;
        return fetch('/api/playlists/getPlaylists', {method: 'GET'})
            .then(response => response.json()).then(data => self.setState({playlists: data}));
    }

    reloadTracks()
    {
        const self = this;
        return fetch('/api/library/ajaxGetInitialTracks', {method: 'GET'})
            .then(response => response.json()).then(data => self.setState({tracks: data}));
    }

    reloadUser()
    {
        const self = this;
        return fetch('/api/users/whoami', {method: 'GET'})
            .then(response => response.json()).then(myUserId => {
                fetch('/api/users/' + myUserId, {method: 'GET'})
                    .then(response => response.json()).then(data => {

                    let lastPlaylistId = data.userState.lastPlaylistId;
                    let lastTrackId = data.userState.lastTrackId;

                    // sanitize selected playlist / track
                    if (!self.state.playlists.some(p => p.id === lastPlaylistId))
                        lastPlaylistId = 0;
                    if (!self.state.tracks.some(p => p.id === lastTrackId))
                    {
                        if (self.state.tracks[0])
                            lastTrackId = self.state.tracks[0].id;
                        else
                            console.log('app:reloadUser: no tracks found?');
                    }

                    self.setState({
                        user: data,
                        selectedPlaylistId: lastPlaylistId,
                        selectedTrackId: lastTrackId,
                        dataLoaded: true
                    })
                });
            });
    }

    reloadTheme()
    {
        const self = this;
        return fetch('/api/systemSettings/theme', {method: 'GET'})
            .then(response => response.text()).then(data => self.setState({theme: data, themeLoaded: true}));
    }

    componentDidMount() {
        const self = this;
        this.reloadTheme();

        const playlistPromise = Promise.resolve(this.reloadPlaylists());
        const trackPromise = Promise.resolve(this.reloadTracks());

        Promise.all([playlistPromise, trackPromise]).then(() => {
            self.reloadUser();
        });
    }
    
    render() {
        const theme = this.state.theme;
        const tracks = this.state.tracks;
        const playlists = this.state.playlists;
        const selectedPlaylistId = this.state.selectedPlaylistId;
        const isAdmin = this.state.user.admin;

        if (!theme)
        {
            return (<div>Loading...</div>)
        }

        // if (!tracks || !playlists || !isAdmin)
        if (!this.state.dataLoaded)
        {
            return (
                <div>
                    <MyHelmet theme={theme}/>
                    <div className="pageloader is-active"><span className="title">Loading...</span></div>
                </div>
            );
        }

        return (
            <Router history={this.state.history}>
                 <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>

                    <MyHelmet theme={theme} tracks={tracks} selectedTrackId={this.state.selectedTrackId}/>
                    <Header isAdmin={isAdmin} playlists={playlists} selectedPlaylistId={selectedPlaylistId}/>

                    <div className={'columns is-gapless'} style={{margin: '0', flex: '1 1 auto', display: 'flex'}}>
                        <div className="column is-2 is-hidden-touch">
                            <SidePanel isAdmin={isAdmin} playlists={playlists} selectedPlaylistId={selectedPlaylistId}/>
                        </div>
                        <div className="column" style={{overflow: 'auto'}}>
                            <Route exact path='/' render={() => <Redirect to='/library' /> } />
                            <Route exact path='/admin/systemSettings' render={() => <SystemSettings onThemeChange={this.handleThemeChange}
                                                                                                    onUpdateTracks={this.reloadTracks}
                                                                                                    onUpdatePlaylists={this.reloadPlaylists} />}/>
                            <Route exact path='/admin/users' render={() => <UserSettings />}/>
                            <Route exact path='/settings/eq' render={() => <Eq />}/>
                            <Route exact path='/artists' render={() => <Artists tracks={tracks} />}/>
                            <Route exact path='/albums' render={() => <Albums tracks={tracks} />}/>

                            <Route exact path='/library' render={(props) => <Playlist {...props}
                                                                                      tracks={tracks}
                                                                                      playlists={playlists}
                                                                                      selectedTrackId={this.state.selectedTrackId}
                                                                                      onCurrentPlaylistChange={this.handleCurrentPlaylistChange}
                                                                                      onSelectedTrackIdChange={this.handleSelectedTrackIdChange} />} />

                            <Switch>
                                <Route exact path='/playlists/new' render={(props) => <LoadablePlaylistBuilder {...props} onUpdatePlaylists={this.reloadPlaylists} />} />
                                <Route exact path='/playlists/:id/edit' render={(props) => <LoadablePlaylistBuilder {...props} onUpdatePlaylists={this.reloadPlaylists}/>} />

                                <Route exact path='/playlists' render={() => <Playlists
                                    selectedPlaylistId={this.state.selectedPlaylistId}
                                    playlists={playlists}
                                    onUpdatePlaylists={this.reloadPlaylists}/>} />
                                <Route exact path='/playlists/:id' render={(props) => <Playlist {...props}
                                                                                                tracks={tracks}
                                                                                                playlists={playlists}
                                                                                                selectedTrackId={this.state.selectedTrackId}
                                                                                                onCurrentPlaylistChange={this.handleCurrentPlaylistChange}
                                                                                                onSelectedTrackIdChange={this.handleSelectedTrackIdChange}
                                                                                                onUpdatePlaylists={this.reloadPlaylists} />} />
                            </Switch>
                        </div>
                    </div>

                    <Player tracks={tracks}
                            playlists={playlists}
                            selectedTrackId={this.state.selectedTrackId}
                            selectedPlaylistId={this.state.selectedPlaylistId}
                            userState={this.state.user.userState}
                            onCurrentPlaylistChange={this.handleCurrentPlaylistChange}
                            onSelectedTrackIdChange={this.handleSelectedTrackIdChange} />

                </div>
            </Router>
        );
    }
}