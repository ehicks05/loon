import React from 'react';
import {Link} from "react-router-dom";
import Albums from "./Albums.jsx";

export default class Artist extends React.Component {
    constructor(props) {
        super(props);

        const artist = this.props.match.params.artist;
        this.state = {artist: artist};
    }

    render()
    {
        const tracks = this.props.tracks;

        const artistTracks = tracks.filter(track => track.artist === this.state.artist);

        const width = 150;

        return (
            <div>
                <div className="title" style={{padding: '.25rem'}}>{this.state.artist}</div>
                <div className="subtitle" style={{padding: '.25rem'}}>Albums</div>

                <Albums tracks={artistTracks} hideTitle={true}/>

            </div>
        );
    }
}