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
        const uiState = this.props.store.uiState;
        const selectedTrack = uiState.selectedTrack;
        const title = selectedTrack ? selectedTrack.title + ' by ' + selectedTrack.artist : 'Loon';

        return (
            <Helmet defer={false}>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>{title}</title>
                <link rel="stylesheet" href={uiState.themeUrl} />
                <link rel="shortcut icon" href={"/images/loon2.png"} />

                <style>
                    {
                        `
                        html {overflow-y: auto !important;}

                        #level {
                            position: fixed;
                            bottom: 0;
                            width: 100%;
                        }
                        
                        section {padding: 10px !important;}
                        
                        .playingHighlight {color: #23d160;}
                        .playingHighlight:focus {outline:0;}
                        
                        .playlist {overflow-y: auto; }
                        
                        .media+.media {padding-top:.2rem;margin-top:.2rem;}
                        
                        .mediaItemDiv {padding: 5px; vertical-align: middle; display: flex; flex-direction: row; justify-content: space-between;
                            transition: all .2s ease}
                        
                        .mediaItemDiv       .mediaItemEllipsis .dropdown{visibility: hidden;}
                        .mediaItemDiv:hover .mediaItemEllipsis .dropdown{visibility: visible;}
                        .mediaItemEllipsis {margin-right: 8px; flex-basis: 20px;}
                        .is-visible-important {visibility: visible !important;}
                        
                        .list-song {flex: 8}
                        .mediaItemCounter {text-align: right; margin-right: 5px; min-width: 30px; flex-basis: 36px;}
                        
                        .ReactVirtualized__List:focus{outline: none;}
                        
                        /* SCROLLBAR */
                        ::-webkit-scrollbar {width: 8px;}
                        
                        /* Track */
                        ::-webkit-scrollbar-track-piece:start {background: transparent url('../images/scrollbar.png') repeat-y !important;}
                        ::-webkit-scrollbar-track-piece:end {background: transparent url('../images/scrollbar.png') repeat-y !important;}
                        
                        /* Handle */
                        ::-webkit-scrollbar-thumb {background: #777;}
                        ::-webkit-scrollbar-thumb:hover {background: #888;}
                        `
                    }
                </style>

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
                         
                         .panel-block {border: none; border-left: 6px solid #282f2f;}
                         .panel-block:first-child {border-top: none;}
                         .panel-block:hover {border-left-color: #3273dc;}
                         
                         .input {color:#eee; background-color:#333;}
                         .select select {color:#eee; background-color:#333;}
                        `
                        :
                        `table {background-color: #EEE !important}
                         .myLevel {background-color: #f4f4f4;}
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
                         
                         .panel-block {border: none; border-left: 6px solid #f4f4f4;}
                         .panel-block:first-child {border-top: none;}
                         .panel-block:hover {border-left-color: #3273dc;}
                        `
                    }
                </style>
            </Helmet>);
    }
}