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
import SidePanel from "./SidePanel.jsx";

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

        fetch('/api/playlists/getPlaylists', {method: 'GET'})
            .then(response => response.json()).then(data => self.setState({playlists: data}));
    }

    reloadTracks()
    {
        const self = this;

        fetch('/api/library/ajaxGetInitialTracks', {method: 'GET'})
            .then(response => response.json()).then(data => self.setState({tracks: data}));
    }

    componentDidMount() {
        const self = this;

        fetch('/api/library/ajaxGetIsAdmin', {method: 'GET'})
            .then(response => response.json()).then(data => self.setState({isAdmin: data}));

        fetch('/api/admin/systemSettings/form', {method: 'GET'})
            .then(response => response.json()).then(data => self.setState({theme: data.theme}));

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

                    <div className={'columns'}>
                        <div className="column is-2 is-hidden-touch">
                            <SidePanel isAdmin={isAdmin} playlists={playlists} selectedPlaylistId={selectedPlaylistId}/>
                        </div>
                        <div className="column">
                            <Route exact path='/' render={() => <Redirect to='/library' /> } />
                            <Route exact path='/admin/systemSettings' render={() => <SystemSettings onThemeChange={this.handleThemeChange} onUpdateTracks={this.reloadTracks}  />}/>
                            <Route exact path='/admin/users' render={() => <div>TODO</div>}/>

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
                            <div style={{height: '300px'}} />
                        </div>
                    </div>

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