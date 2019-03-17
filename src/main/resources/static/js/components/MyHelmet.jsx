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
        const title = selectedTrack ? selectedTrack.title : 'Loon';

        return (
            <Helmet defer={false}>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>{title}</title>

                <link rel="stylesheet" href={uiState.themeUrl} />

                <link rel="shortcut icon" href={basename + "/images/loon2.png"} />
                <link rel="stylesheet" type="text/css" href={basename + "/styles/style.css"} media="screen" />

                <style>
                    {uiState.isDarkTheme ?
                        `.myLevel {background-color: #282f2f; color: #ddd}
                         #left-column {background-color: #282f2f;}
                         .panel-block {border-left-color: #282f2f;}
                         #headerLogo {filter: invert(100%);}
                         .mediaItemDiv:hover {background-color: #282f2f;}

                         .mediaItemDiv a {color:#aaa}
                         .mediaItemDiv a:hover {color:#ccc}
                         .dropdown a {color:#aaa}
                         .dropdown a:hover {color:#ccc}
                         .card a {color:#aaa}
                         .card a:hover {color:#ccc}
                         .myLevel a {color:#aaa}
                         .myLevel a:hover {color:#ccc}
                        `
                        :
                        `.myLevel {background-color: #f4f4f4;}
                         #left-column {background-color: #f4f4f4;}
                         .mediaItemDiv:hover {background-color: #f4f4f4;}
                         .mediaItemDiv a {color:#666}
                         .mediaItemDiv a:hover {color:#888}
                         .dropdown a {color:#666}
                         .dropdown a:hover {color:#888}
                         .card a {color:#666}
                         .card a:hover {color:#888}
                         .myLevel a {color:#666}
                         .myLevel a:hover {color:#888}
                        `
                    }
                </style>
            </Helmet>);
    }
}