import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App.jsx';
import {Provider} from "mobx-react";
import {RootStore} from "../stores/RootStore";
import {UserContextProvider} from "../components/UserContextProvider";
import {AppContextProvider} from "../components/AppContextProvider";

const rootStore = new RootStore();

ReactDOM.render(
    <Suspense fallback={<div>Loading...</div>}>
        <UserContextProvider>
            <AppContextProvider>
                <Provider store={rootStore}>
                    <App />
                </Provider>
            </AppContextProvider>
        </UserContextProvider>
    </Suspense>
    ,
    document.getElementById('root')
);

