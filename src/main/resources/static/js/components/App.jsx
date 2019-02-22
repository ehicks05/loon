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
import PlaylistBuilder from "./PlaylistBuilder.jsx";

import SidePanel from "./SidePanel.jsx";
import UserSettings from "./UserSettings.jsx";
import Artists from "./Artists.jsx";
import Albums from "./Albums.jsx";
import Artist from "./Artist.jsx";
import Search from "./Search.jsx";
import Album from "./Album.jsx";
import {inject, observer} from "mobx-react";

function poll()
{
    fetch('/api/poll', {method: 'GET'})
        .then(response => response.text()).then(text => console.log("poll result: " + text));
}

@inject('store')
@observer
export default class App extends React.Component {

    constructor(props) {
        super(props);
        let self = this;

        const basename = '/';
        const history = createBrowserHistory({ basename });
        self.state = {history: history};
    }

    componentDidMount() {
        const pollIntervalId = setInterval(poll, 60 * 60 * 1000); // once an hour
    }

    render() {
        const store = this.props.store;
        if (!store.uiState.theme)
            return (<div>Loading...</div>);

        if (!store.dataLoaded)
        {
            return (
                <div>
                    <MyHelmet/>
                    <div className={"pageloader is-active" + (store.uiState.isDarkTheme ? ' is-dark ' : '')}><span className="title">Loading...</span></div>
                </div>
            );
        }

        return (
            <Router history={this.state.history}>
                 <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
                    <MyHelmet />
                    <Header />

                    <div className={'columns is-gapless'} style={{margin: '0', flex: '1 1 auto', display: 'flex'}}>
                        <div id='left-column' className={"column is-narrow is-hidden-touch" + (store.uiState.isDarkTheme ? ' is-dark ' : '')} style={{overflow: 'auto'}}>
                            <SidePanel />
                        </div>
                        <div className="column" style={{overflow: 'auto'}}>
                            <Route exact path='/'                               render={() => <Redirect to='/search' /> } />
                            <Route exact path='/admin/systemSettings'           render={() => <SystemSettings />}/>
                            <Route exact path='/admin/users'                    render={() => <UserSettings />}/>
                            <Route exact path='/settings/eq'                    render={() => <Eq />}/>
                            <Route exact path='/albums'                         render={() => <Albums />}/>
                            <Route exact path='/artists'                        render={() => <Artists />}/>
                            <Route exact path='/artist/:artist'                 render={(props) => <Artist {...props} />}/>
                            <Route exact path='/artist/:artist/album/:album'    render={(props) => <Album {...props} />} />
                            <Route exact path='/search'                         render={(props) => <Search {...props} />} />
                            <Route exact path='/favorites'                      render={(props) => <Playlist {...props} />} />
                            <Route exact path='/queue'                          render={(props) => <Playlist {...props} />} />

                            <Switch>
                                <Route exact path='/playlists/new'              render={(props) => <PlaylistBuilder {...props} />} />
                                <Route exact path='/playlists/:id/edit'         render={(props) => <PlaylistBuilder {...props} />} />

                                <Route exact path='/playlists'                  render={() => <Playlists />} />
                                <Route exact path='/playlists/:id'              render={(props) => <Playlist {...props} />} />
                            </Switch>
                        </div>
                    </div>

                    <Player muted={store.uiState.user.userState.muted}
                            volume={store.uiState.user.userState.volume}
                            selectedTrackId={store.uiState.selectedTrackId}
                    />
                </div>
            </Router>
        );
    }
}