import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App.jsx';
import {Provider} from "mobx-react";
import {RootStore} from "../stores/RootStore";

const rootStore = new RootStore();

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.unstable_createRoot(document.getElementById('root')).render(<Suspense fallback={<div>Loading...</div>}><Provider store={rootStore}><App /></Provider></Suspense>);

