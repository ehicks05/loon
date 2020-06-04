import React, {lazy} from 'react';
import {Router} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import 'bulma-extensions/bulma-pageloader/dist/css/bulma-pageloader.min.css'
import {inject, observer} from "mobx-react";

import Header from "./Header.jsx";
import MyHelmet from "./MyHelmet.jsx";
import Player from "./Player.jsx";
import Routes from "./Routes";

const SidePanel = lazy(() => import('./SidePanel.jsx'));

@inject('store')
@observer
export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {history: createBrowserHistory({ basename: '/' })};
    }

    componentDidMount() {
        const pollIntervalId = setInterval(function () {
            fetch('/api/poll', {method: 'GET'})
                .then(response => response.text()).then(text => console.log("poll result: " + text));
        }, 60 * 60 * 1000); // once an hour

        this.props.store.uiState.getScreenDimensions();
        this.props.store.uiState.getWindowDimensions();
    }

    render() {
        const store = this.props.store;

        if (!store.dataLoaded)
        {
            return (
                <>
                    <MyHelmet/>
                    <div className={"pageloader is-active is-dark"}><span className="title">Loading...</span></div>
                </>
            );
        }

        const innerHeight = this.props.store.uiState.windowDimensions.height;
        const footerHeight = this.props.store.uiState.windowDimensions.width <= 768 ? 103 : 54;
        // const columnHeight = 'calc(' + innerHeight + 'px - (52px + 23px + ' + footerHeight + '))';
        const ch = Number(innerHeight) - (52 + 23 + Number(footerHeight));
        const columnHeight = '' + ch + 'px';
        console.log('New columnHeight: ' + columnHeight + '... window height('+innerHeight+') - (header height('+52+') + footer height(23 + '+footerHeight+'))):');

        return (
            <Router history={this.state.history}>
                <>
                    <MyHelmet />
                    <Header />

                    <div className={'columns is-gapless'}>
                        <div id='left-column' style={{height: columnHeight, overflow: 'hidden auto'}} className={"column is-narrow is-hidden-touch"}>
                            <div style={{height: '98%', display: 'flex', flexDirection: 'column'}}>
                                <div style={{overflowY: 'auto'}}><SidePanel playlists={store.appState.playlists} /></div>
                                <div style={{flex: '1 1 auto'}}> </div>
                                <div style={{height: '100px'}}>
                                    <canvas id='spectrumCanvas' height={100} width={150}> </canvas>
                                </div>
                            </div>
                        </div>
                        <div className="column" style={{height: columnHeight, overflow: 'hidden auto'}}>
                            <Routes admin={store.uiState.user.admin} />
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
                </>
            </Router>
        );
    }
}