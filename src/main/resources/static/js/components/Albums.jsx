import React from 'react';
import {Link} from "react-router-dom";

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

        let albums = [...new Set(tracks.map(track => {return JSON.stringify({artist: track.albumArtist, album: track.album, albumImageId: track.albumImageId})}))];
        albums = albums.map(album => JSON.parse(album));
        albums = albums.sort((a1, a2) => {
            if (a1.artist < a2.artist) return -1;
            if (a1.artist > a2.artist) return 1;
            return 0;
        });

        const albumItems = albums.map((album) => {
            // const album = JSON.parse(albumJson);
            return <AlbumCard key={album.artist + '-' + album.album} album={album} />
        });

        const width = 150;

        return (
            <div>
                <div className="title" style={{padding: '.25rem'}}>{albums.length} Albums:</div>
                <div id="playlist" className="playlist" style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{padding: '.25rem', flex: '1', flexGrow: '1'}}>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(' + width + 'px, 1fr))', gridGap: '.5em'}}>
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
    const width = 150;
    const imageUrl = props.album.albumImageId ? '/art/' + props.album.albumImageId
        : 'https://via.placeholder.com/' + width + 'x' + width + '.png?text=' + width + 'x' + width;
    return (
        <div className="card">
            <div className="card-image">
                <figure className={"image is-square"}>
                    <img src={imageUrl} alt="Placeholder image" />
                </figure>
            </div>
            <div className="card-content" style={{padding: '.75rem'}}>
                <div className="content">
                    <Link to={'/artist/' + props.album.artist + '/album/' + props.album.album}>{props.album.artist + ' - ' + props.album.album}</Link>
                </div>
            </div>
        </div>
    );
}