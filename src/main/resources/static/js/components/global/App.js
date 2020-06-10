import React, {lazy, useContext, useEffect, useState} from 'react';
import {Router} from 'react-router-dom'
import {createBrowserHistory} from 'history'
import 'bulma-extensions/bulma-pageloader/dist/css/bulma-pageloader.min.css'
import 'bulma/css/bulma.min.css'

import Header from "./Header";
import MyHelmet from "./MyHelmet";
import Player from "../player/Player";
import Routes from "./Routes";
import {UserContext} from "../../common/UserContextProvider";
import {AppContext} from "../../common/AppContextProvider";
import useWindowSize from "../../common/WindowSizeHook";

const SidePanel = lazy(() => import('./SidePanel'));

export default function App(props) {
    const [history, setHistory] = useState({})

    const userContext = useContext(UserContext);
    const appContext = useContext(AppContext);
    const windowSize = useWindowSize();

    useEffect(() => {
        setHistory(createBrowserHistory({ basename: '/' }));

        const pollIntervalId = setInterval(function () {
            fetch('/api/poll', {method: 'GET'})
                .then(response => response.text())
                .then(text => console.log("poll result: " + text));
        }, 60 * 60 * 1000); // once an hour

        return function cleanup() {
            clearInterval(pollIntervalId);
        };
    }, []);

    const dataLoaded = userContext && userContext.user && appContext && appContext.tracks && appContext.playlists;
    if (!dataLoaded)
    {
        return (
            <>
                <MyHelmet/>
                <div className={"pageloader is-active is-success"} />
            </>
        );
    }

    const innerHeight = windowSize.height;
    const footerHeight = windowSize.width <= 768 ? 103 : 54;
    // const columnHeight = 'calc(' + innerHeight + 'px - (52px + 23px + ' + footerHeight + '))';
    const columnHeight = '' + (Number(innerHeight) - (52 + 23 + Number(footerHeight))) + 'px';
    console.log('New columnHeight: ' + columnHeight + '... window height('+innerHeight+') - (header height('+52+') + footer height(23 + '+footerHeight+'))):');

    return (
        <Router history={history}>
            <MyHelmet />
            <Header />

            <div className={'columns is-gapless'}>
                <div id='left-column' style={{height: columnHeight, overflow: 'hidden auto'}} className={"column is-narrow is-hidden-touch"}>
                    <div style={{height: '98%', display: 'flex', flexDirection: 'column'}}>
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

            <Player />
        </Router>
    );
}