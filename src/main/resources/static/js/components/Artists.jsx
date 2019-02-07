import React from 'react';

export default class Artists extends React.Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {

    }

    render()
    {
        const tracks = this.props.tracks;

        const artists = [...new Set(tracks.map(track => {return track.artist}))];

        const artistItems = artists.map((artist, index) => {
            return <li key={artist}>{index + 1}. {artist}</li>
        });

        return (
            <div>
                <div className="title">Artists:</div>
                <div id="playlist" className="playlist" style={{display: 'flex', flexDirection: 'column'}}>
                    <ul id="list" style={{flex: '1', flexGrow: '1'}}>
                        {artistItems}
                    </ul>
                </div>
            </div>
        );
    }
}