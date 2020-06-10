import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import App from '../components/global/App';
import {UserContextProvider} from "../common/UserContextProvider";
import {AppContextProvider} from "../common/AppContextProvider";
import {VolumeContextProvider} from "../common/VolumeContextProvider";
import {TimeContextProvider} from "../common/TimeContextProvider";

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

