import React from 'react';
import {Redirect, Route, Router, Switch} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import 'bulma-extensions/bulma-pageloader/dist/css/bulma-pageloader.min.css'

import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import Player from "./Player.jsx";
import MyHelmet from "./MyHelmet.jsx";
import SystemSettings from "./SystemSettings.jsx";
import Playlist from "./Playlist.jsx";
import Playlists from "./Playlists.jsx";
// import PlaylistBuilder from "./PlaylistBuilder.jsx";

import Loadable from "react-loadable";

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

        const basename = '/';
        const history = createBrowserHistory({ basename });
        self.state = {history: history};

        // self.state.tracks = [];
        self.state.selectedTrackId = 1;
        // self.state.playlists = [];
        self.state.selectedPlaylistId = 0;
    }

    handleCurrentPlaylistChange(selectedPlaylistId, selectedTrackId)
    {
        this.setState({selectedPlaylistId: selectedPlaylistId, selectedTrackId: selectedTrackId});
    }

    handleSelectedTrackIdChange(selectedTrackId)
    {
        this.setState({selectedTrackId: selectedTrackId});
    }

    handleThemeChange(newTheme)
    {
        this.setState({theme: newTheme});
    }

    reloadPlaylists()
    {
        const self = this;

        let xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/playlists/getPlaylists', false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                self.setState({playlists: JSON.parse(this.responseText)});
            }
            else {
                console.log('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
    }

    reloadTracks()
    {
        const self = this;

        let url = '/api/library/ajaxGetInitialTracks';
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                self.setState({tracks: JSON.parse(this.responseText)});
            }
            else {
                console.log('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
    }

    componentDidMount() {
        const self = this;

        let xhr = new XMLHttpRequest();

        xhr.open('GET', '/api/library/ajaxGetIsAdmin', false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                self.setState({isAdmin: JSON.parse(this.responseText)});
            }
            else {
                console.log('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();

        xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/admin/systemSettings/form', false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                self.setState({theme: JSON.parse(this.responseText).theme});
            }
            else {
                console.log('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();

        this.reloadPlaylists();
        this.reloadTracks();
    }
    
    render() {
        const tracks = this.state.tracks;
        const playlists = this.state.playlists;
        const selectedPlaylistId = this.state.selectedPlaylistId;
        const isAdmin = this.state.isAdmin;

        if (!tracks || !playlists)
        {
            return (
                <div>
                    <MyHelmet theme={this.state.theme}/>
                    <div className="pageloader is-active"><span className="title">Loading...</span></div>
                </div>
            );
        }

        return (
            <Router history={this.state.history}>
                <div>

                    <MyHelmet theme={this.state.theme}/>
                    <Header isAdmin={isAdmin} playlists={playlists} selectedPlaylistId={selectedPlaylistId}/>

                    <Route exact path='/' render={() => <Redirect to='/library' /> } />
                    <Route exact path='/admin/systemSettings' render={() => <SystemSettings onThemeChange={this.handleThemeChange} onUpdateTracks={this.reloadTracks}  />}/>

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

                    {/* Prevents the PlaybackControls from covering up the last few tracks. */}
                    <div style={{height: '650px'}} />

                    <Player tracks={tracks}
                            selectedTrackId={this.state.selectedTrackId}
                            playlists={playlists}
                            selectedPlaylistId={this.state.selectedPlaylistId}
                            onCurrentPlaylistChange={this.handleCurrentPlaylistChange}
                            onSelectedTrackIdChange={this.handleSelectedTrackIdChange} />

                    <Footer serverProcessingTime="123"/>
                </div>
            </Router>
        );
    }
}