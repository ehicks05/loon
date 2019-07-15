import React, { Suspense, lazy } from 'react';
import {Redirect, Route, Router, Switch} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import 'bulma-extensions/bulma-pageloader/dist/css/bulma-pageloader.min.css'
import {inject, observer} from "mobx-react";

import Header from "./Header.jsx";
import MyHelmet from "./MyHelmet.jsx";
import Player from "./Player.jsx";
import SystemStatusBar from "./SystemStatusBar.jsx";
const SystemSettings = lazy(() => import('./SystemSettings.jsx'));
const Playlist = lazy(() => import('./Playlist.jsx'));
const Playlists = lazy(() => import('./Playlists.jsx'));
const GeneralSettings = lazy(() => import('./GeneralSettings.jsx'));
const Eq = lazy(() => import('./Eq.jsx'));
const PlaylistBuilder = lazy(() => import('./PlaylistBuilder.jsx'));

const SidePanel = lazy(() => import('./SidePanel.jsx'));
const UserSettings = lazy(() => import('./UserSettings.jsx'));
const Artists = lazy(() => import('./Artists.jsx'));
const Albums = lazy(() => import('./Albums.jsx'));
const Artist = lazy(() => import('./Artist.jsx'));
const Search = lazy(() => import('./Search.jsx'));
const Album = lazy(() => import('./Album.jsx'));

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

        this.props.store.uiState.getScreenDimensions();
        this.props.store.uiState.getWindowDimensions();
    }

    render() {
        const store = this.props.store;
        if (!store.uiState.theme)
            return (<div> </div>);

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
                <div style={{display: 'flex', flexDirection: 'column', height: this.props.store.uiState.windowDimensions.height}}>
                    <MyHelmet />
                    <Header />
                    <SystemStatusBar />

                    <div className={'columns is-gapless'} style={{margin: '0', flex: '1 1 auto', display: 'flex'}}>
                        <div id='left-column' className={"column is-narrow is-hidden-touch" + (store.uiState.isDarkTheme ? ' is-dark ' : '')} style={{overflowY: 'auto'}}>
                            <div style={{height: '99%', display: 'flex', flexDirection: 'column'}}>
                                <div style={{overflowY: 'auto'}}><SidePanel /></div>
                                <div style={{flex: '1 1 auto'}}> </div>
                                <div style={{height: '100px'}}>
                                    <canvas id='spectrumCanvas' height={100} width={150}> </canvas>
                                </div>
                            </div>
                        </div>
                        <div className="column" style={{overflowY: 'auto', overflowX: 'hidden', height: '100%'}}>
                            <Suspense fallback={<div>Loading...</div>}>

                                <Route exact path='/'                               render={() => <Redirect to='/search' /> } />
                                <Route exact path='/admin/systemSettings'           render={() => <SystemSettings />}/>
                                <Route exact path='/admin/users'                    render={() => <UserSettings />}/>
                                <Route exact path='/settings/general'               render={() => <GeneralSettings />}/>
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
                            </Suspense>
                        </div>
                    </div>

                    <Player muted={store.uiState.user.userState.muted}
                            volume={store.uiState.user.userState.volume}
                            selectedTrackId={store.uiState.selectedTrackId}
                            eq1Freq={store.uiState.user.userState.eq1Frequency}
                            eq1Gain={store.uiState.user.userState.eq1Gain}
                            eq2Freq={store.uiState.user.userState.eq2Frequency}
                            eq2Gain={store.uiState.user.userState.eq2Gain}
                            eq3Freq={store.uiState.user.userState.eq3Frequency}
                            eq3Gain={store.uiState.user.userState.eq3Gain}
                            eq4Freq={store.uiState.user.userState.eq4Frequency}
                            eq4Gain={store.uiState.user.userState.eq4Gain}
                    />
                </div>
            </Router>
        );
    }
}