import React from 'react';
import { Router, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'
import 'bulma-extensions/bulma-pageloader/dist/bulma-pageloader.min.css'

import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import Library from "./Library.jsx";
import Player from "./Player.jsx";
import MyHelmet from "./MyHelmet.jsx";
import SystemSettings from "./SystemSettings.jsx";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        let self = this;

        this.handleCurrentTrackIndexChange = this.handleCurrentTrackIndexChange.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);

        const basename = '/loon/view/';
        const history = createBrowserHistory({ basename });
        self.state = {history: history};
        self.state.currentTrackIndex = 0;
    }

    handleCurrentTrackIndexChange(newIndex)
    {
        this.setState({currentTrackIndex: newIndex});
    }

    handleThemeChange(newTheme)
    {
        this.setState({theme: newTheme});
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
                console.log('theme is now: ' + JSON.parse(this.responseText).theme);
                console.log('theme is now: ' + self.state.theme);
            }
            else {
                console.log('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();

        xhr = new XMLHttpRequest();
        xhr.open('GET', basename + 'library?action=ajaxGetInitialTracks', true);
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
        const isAdmin = this.state.isAdmin;

        if (!tracks)
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

                    <Route path='/admin/systemSettings' render={() => <SystemSettings onThemeChange={this.handleThemeChange} />}/>
                    <Route path='/library' render={() => <Library audioTracks={tracks} currentTrackIndex={this.state.currentTrackIndex} onCurrentTrackIndexChange={this.handleCurrentTrackIndexChange} />} />
                    <Player audioTracks={tracks} currentTrackIndex={this.state.currentTrackIndex} onCurrentTrackIndexChange={this.handleCurrentTrackIndexChange} />

                    <Footer serverProcessingTime="123"/>
                </div>
            </Router>
        );
    }
}