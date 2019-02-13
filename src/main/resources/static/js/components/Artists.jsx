import React from 'react';
import {Link} from "react-router-dom";

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

        const artists = [...new Set(tracks.map(track => {return JSON.stringify({artist: track.artist, artistImageId: track.artistImageId})}))];

        const artistItems = artists.map((artistJson) => {
            const artist = JSON.parse(artistJson);
            return <ArtistCard key={artist.artist} artist={artist} />
        });

        const width = 150;

        return (
            <div>
                <div className="title" style={{padding: '.25rem'}}>{artists.length} Artists:</div>
                <div id="playlist" className="playlist" style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{padding: '.25rem', flex: '1', flexGrow: '1'}}>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(' + width + 'px, 1fr))', gridGap: '.5em'}}>
                            {artistItems}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function ArtistCard(props)
{
    const width = 150;
    const imageUrl = props.artist.artistImageId ? '/art/' + props.artist.artistImageId
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
                    <Link to={'/artist/' + props.artist.artist}>{props.artist.artist}</Link>
                </div>
            </div>
        </div>
    );
}