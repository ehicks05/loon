import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';
import {UserContextProvider} from "../components/UserContextProvider";
import {AppContextProvider} from "../components/AppContextProvider";
import {VolumeContextProvider} from "../components/VolumeContextProvider";
import {TimeContextProvider} from "../components/TimeContextProvider";

ReactDOM.render(
    <Suspense fallback={<div className={"pageloader is-active is-success"} />}>
        <UserContextProvider>
            <AppContextProvider>
                <VolumeContextProvider>
                    <TimeContextProvider>
                        <App />
                    </TimeContextProvider>
                </VolumeContextProvider>
            </AppContextProvider>
        </UserContextProvider>
    </Suspense>
    ,
    document.getElementById('root')
);

