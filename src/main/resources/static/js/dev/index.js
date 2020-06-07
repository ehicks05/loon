import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';
import {UserContextProvider} from "../components/UserContextProvider";
import {AppContextProvider} from "../components/AppContextProvider";

ReactDOM.render(
    <Suspense fallback={<div className={"pageloader is-active is-success"} />}>
        <UserContextProvider>
            <AppContextProvider>
                <App />
            </AppContextProvider>
        </UserContextProvider>
    </Suspense>
    ,
    document.getElementById('root')
);

