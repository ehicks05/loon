import React from 'react';

export default class Albums extends React.Component {
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

        const albums = [...new Set(tracks.map(track => {return JSON.stringify({artist: track.artist, album: track.album})}))];

        const albumItems = albums.map((albumJson, index) => {
            const album = JSON.parse(albumJson);
            return <li key={album.artist + '-' + album.album}>{index + 1}. {album.artist} - {album.album}</li>
        });

        return (
            <div>
                <div className="title">Albums:</div>
                <div id="playlist" className="playlist" style={{display: 'flex', flexDirection: 'column'}}>
                    <ul id="list" style={{flex: '1', flexGrow: '1'}}>
                        {albumItems}
                    </ul>
                </div>
            </div>
        );
    }
}