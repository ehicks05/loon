import React, { lazy } from 'react';
import {Router} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import 'bulma-extensions/bulma-pageloader/dist/css/bulma-pageloader.min.css'
import {inject, observer} from "mobx-react";

import Header from "./Header.jsx";
import MyHelmet from "./MyHelmet.jsx";
import Player from "./Player.jsx";
import SystemStatusBar from "./SystemStatusBar.jsx";
import Routes from "./Routes";

const SidePanel = lazy(() => import('./SidePanel.jsx'));

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
        const pollIntervalId = setInterval(function () {
            fetch('/api/poll', {method: 'GET'})
                .then(response => response.text()).then(text => console.log("poll result: " + text));
        }, 60 * 60 * 1000); // once an hour

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
                <>
                    <MyHelmet/>
                    <div className={"pageloader is-active" + (store.uiState.isDarkTheme ? ' is-dark ' : '')}><span className="title">Loading...</span></div>
                </>
            );
        }

        const footerHeight = this.props.store.uiState.windowDimensions.width <= 768 ? '103px' : '54px';
        const columnHeight = 'calc(100vh - (52px + 23px + ' + footerHeight + '))';
        return (
            <Router history={this.state.history}>
                <>
                    <MyHelmet />
                    <Header />
                    <SystemStatusBar />

                    <div className={'columns is-gapless'}>
                        <div id='left-column' style={{height: columnHeight, overflow: 'hidden auto'}} className={"column is-narrow is-hidden-touch" + (store.uiState.isDarkTheme ? ' is-dark ' : '')}>
                            <div style={{height: '99%', display: 'flex', flexDirection: 'column'}}>
                                <div style={{overflowY: 'auto'}}><SidePanel /></div>
                                <div style={{flex: '1 1 auto'}}> </div>
                                <div style={{height: '100px'}}>
                                    <canvas id='spectrumCanvas' height={100} width={150}> </canvas>
                                </div>
                            </div>
                        </div>
                        <div className="column" style={{height: columnHeight, overflow: 'hidden auto'}}>
                            <Routes />
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