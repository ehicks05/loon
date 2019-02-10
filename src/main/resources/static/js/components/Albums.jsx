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

        const albums = [...new Set(tracks.map(track => {return JSON.stringify({artist: track.artist, album: track.album, albumImageId: track.albumImageId})}))];

        const albumItems = albums.map((albumJson) => {
            const album = JSON.parse(albumJson);
            return <AlbumCard key={album.artist + '-' + album.album} album={album} />
        });

        return (
            <div>
                <div className="title">{albums.length} Albums:</div>
                <div id="playlist" className="playlist" style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{flex: '1', flexGrow: '1'}}>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gridGap: '.5em'}}>
                            {albumItems}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function AlbumCard(props)
{
    const imageUrl = props.album.albumImageId ? '/art/' + props.album.albumImageId : 'https://via.placeholder.com/300x300.png?text=300x300';
    return (
        <div className="card" style={{width: '300px'}}>
            <div className="card-image">
                <figure className="image is-300x300">
                    <img src={imageUrl} alt="Placeholder image" />
                </figure>
            </div>
            <div className="card-content">
                <div className="media">
                    <div className="content">
                        <p className="title is-4">{props.album.artist + ' - ' + props.album.album}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}