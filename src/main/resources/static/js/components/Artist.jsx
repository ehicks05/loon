import React from 'react';
import Albums from "./Albums.jsx";
import {inject, observer} from "mobx-react";

@inject('store')
@observer
export default class Artist extends React.Component {
    constructor(props) {
        super(props);
    }

    render()
    {
        const artist = this.props.match.params.artist;
        const tracks = this.props.store.appState.tracks;

        const artistTracks = tracks.filter(track => track.artist === artist);

        return (
            <div>
                <div className="title" style={{padding: '.25rem'}}>{artist}</div>
                <div className="subtitle" style={{padding: '.25rem'}}>Albums</div>

                <Albums tracks={artistTracks} hideTitle={true}/>

            </div>
        );
    }
}