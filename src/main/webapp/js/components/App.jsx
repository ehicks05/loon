import React from 'react';
import { Router, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history'

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

        let xhr = new XMLHttpRequest();
        xhr.open('GET', basename + 'library?action=ajaxGetInitialTracks', false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                self.state.tracks = JSON.parse(this.responseText);
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();

        xhr = new XMLHttpRequest();
        xhr.open('GET', basename + 'library?action=ajaxGetIsAdmin', false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                self.state.isAdmin = JSON.parse(this.responseText);
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();

        self.state.currentTrackIndex = 0;

        xhr = new XMLHttpRequest();
        xhr.open('GET', basename + 'admin/systemSettings?action=form', false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                self.state.theme = JSON.parse(this.responseText).theme;
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
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

    }
    
    render() {
        const tracks = this.state.tracks;
        const isAdmin = this.state.isAdmin;

        return (
            <Router history={this.state.history}>
                <div>

                    <MyHelmet theme={this.state.theme}/>
                    <Header currentTab1="library" currentTab2="" isAdmin={isAdmin}/>

                    <Route path='/admin/systemSettings' render={() => <SystemSettings onThemeChange={this.handleThemeChange} />}/>
                    <Route path='/library' render={() => <Library audioTracks={tracks} currentTrackIndex={this.state.currentTrackIndex} onCurrentTrackIndexChange={this.handleCurrentTrackIndexChange} />} />

                    <Player audioTracks={tracks} currentTrackIndex={this.state.currentTrackIndex} onCurrentTrackIndexChange={this.handleCurrentTrackIndexChange} />

                    <Footer serverProcessingTime="123"/>
                </div>
            </Router>
        );
    }
}