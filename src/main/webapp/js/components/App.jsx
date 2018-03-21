import React from 'react';
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import Library from "./Library.jsx";
import Player from "./Player.jsx";

export default class App extends React.Component {

    constructor(props) {
        super(props);
        let self = this;

        this.handleCurrentTrackIndexChange = this.handleCurrentTrackIndexChange.bind(this);

        let xhr = new XMLHttpRequest();
        xhr.open('GET', window.location.pathname + '?tab1=library&action=ajaxGetInitialTracks', false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                const tracks = JSON.parse(this.responseText);
                self.state = {tracks: tracks};
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();

        xhr = new XMLHttpRequest();
        xhr.open('GET', window.location.pathname + '?tab1=library&action=ajaxGetVisibleAdminScreens', false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                self.state.adminScreens = JSON.parse(this.responseText);
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();

        xhr = new XMLHttpRequest();
        xhr.open('GET', window.location.pathname + '?tab1=library&action=ajaxGetIsAdmin', false);
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
    }

    handleCurrentTrackIndexChange(newIndex)
    {
        this.setState({currentTrackIndex: newIndex});
    }

    componentDidMount() {

    }
    
    render() {
        const tracks = this.state.tracks;
        const adminScreens = this.state.adminScreens;
        const isAdmin = this.state.isAdmin;

        return (
            <div style={{textAlign: 'center'}}>
                <Header currentTab1="library" currentTab2="" isAdmin={isAdmin} pathName={window.location.pathname} adminSubscreens={adminScreens}/>

                <Library audioTracks={tracks} currentTrackIndex={this.state.currentTrackIndex} onCurrentTrackIndexChange={this.handleCurrentTrackIndexChange} />
                <Player audioTracks={tracks} currentTrackIndex={this.state.currentTrackIndex} onCurrentTrackIndexChange={this.handleCurrentTrackIndexChange} />

                <Footer serverProcessingTime="123"/>
            </div>
        );
    }

}