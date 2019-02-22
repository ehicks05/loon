import React from 'react';
import Helmet from 'react-helmet';
import {inject, observer} from "mobx-react";

@inject('store')
@observer
export default class MyHelmet extends React.Component {
    constructor(props) {
        super(props);
    }

    render()
    {
        const basename = '';
        const uiState = this.props.store.uiState;
        const selectedTrack = uiState.selectedTrack;
        const trackTitle = selectedTrack ? ' - ' + selectedTrack.title : '';

        return (
            <Helmet defer={false}>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Loon{trackTitle}</title>

                <link rel="stylesheet" href={uiState.themeUrl} />

                <link rel="shortcut icon" href={basename + "/images/puffin.png"} />
                <link rel="stylesheet" type="text/css" href={basename + "/styles/style.css"} media="screen" />

                <style>
                    {uiState.isDarkTheme ?
                        `.myLevel {background-color: #282f2f;}
                         #left-column {background-color: #282f2f;}
                         .panel-block {border-left-color: #282f2f;}
                         #headerLogo {filter: invert(100%);}
                         .mediaItemDiv:hover {background-color: #282f2f;}
                        `
                        :
                        `.myLevel {background-color: #f4f4f4;}
                         #left-column {background-color: #f4f4f4;}
                         .mediaItemDiv:hover {background-color: #f4f4f4;}
                        `
                    }
                </style>
            </Helmet>);
    }
}