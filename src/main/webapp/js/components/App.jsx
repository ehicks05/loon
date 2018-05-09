import React from 'react';
import {Route, Router, Switch} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import 'bulma-extensions/bulma-pageloader/dist/bulma-pageloader.min.css'

import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import Player from "./Player.jsx";
import MyHelmet from "./MyHelmet.jsx";
import SystemSettings from "./SystemSettings.jsx";
import Playlist from "./Playlist.jsx";
import Playlists from "./Playlists.jsx";
import PlaylistBuilder from "./PlaylistBuilder.jsx";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        let self = this;

        this.handleCurrentPlaylistChange = this.handleCurrentPlaylistChange.bind(this);
        this.handleSelectedTrackIdChange = this.handleSelectedTrackIdChange.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);
        this.reloadPlaylists = this.reloadPlaylists.bind(this);

        const basename = '/loon/view/';
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
        const basename = '/loon/view/';
        const self = this;

        let xhr = new XMLHttpRequest();
        xhr.open('GET', basename + 'playlists?action=getPlaylists', false);
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

    componentDidMount() {
        const basename = '/loon/view/';
        const self = this;

        let xhr = new XMLHttpRequest();

        xhr.open('GET', basename + 'library?action=ajaxGetIsAdmin', false);
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
        xhr.open('GET', basename + 'admin/systemSettings?action=form', false);
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

        let url = basename + 'library?action=ajaxGetInitialTracks';
        xhr = new XMLHttpRequest();
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
    
    render() {
        const tracks = this.state.tracks;
        const playlists = this.state.playlists;
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
                    <Header isAdmin={isAdmin}/>

                    <Route exact path='/admin/systemSettings' render={() => <SystemSettings onThemeChange={this.handleThemeChange} />}/>

                    <Route exact path='/library' render={(props) => <Playlist {...props}
                                                                              tracks={tracks}
                                                                              playlists={playlists}
                                                                              selectedTrackId={this.state.selectedTrackId}
                                                                              onCurrentPlaylistChange={this.handleCurrentPlaylistChange}
                                                                              onSelectedTrackIdChange={this.handleSelectedTrackIdChange} />} />

                    <Switch>
                        <Route exact path='/playlists/new' render={(props) => <PlaylistBuilder {...props} onUpdatePlaylists={this.reloadPlaylists} />} />
                        <Route exact path='/playlists/:id/edit' render={(props) => <PlaylistBuilder {...props} onUpdatePlaylists={this.reloadPlaylists}/>} />

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
                    <div style={{height: '150px'}} />

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