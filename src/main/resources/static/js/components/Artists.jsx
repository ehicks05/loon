import React from 'react';
import {Link} from "react-router-dom";
import {inject, observer} from "mobx-react";
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import ActionMenu from "./ActionMenu.jsx";

@inject('store')
@observer
export default class Artists extends React.Component {
    constructor(props) {
        super(props);
    }

    render()
    {
        const tracks = this.props.store.appState.tracks;

        const artists = [...new Set(tracks.map(track => {return JSON.stringify({artistName: track.artist, artistImageId: track.artistThumbnailId})}))];

        const artistItems = artists.map((artistJson) => {
            const artist = JSON.parse(artistJson);
            return <ArtistCard key={artist.artistName} artist={artist} />
        });

        const windowWidth = this.props.store.uiState.windowDimensions.width;
        const gridItemWidth = windowWidth <= 768 ? 150 :
            windowWidth < 1024 ? 175 :
                windowWidth < 1216 ? 200 :
                    windowWidth < 1408 ? 225 :
                        250;

        return (
            <div>
                <div className="title" style={{padding: '.5rem'}}>{artists.length} Artists:</div>
                <div id="playlist" className="playlist" style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{padding: '.5rem', flex: '1', flexGrow: '1'}}>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(' + gridItemWidth + 'px, 1fr))', gridGap: '.5em'}}>
                            {artistItems}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

@inject('store')
@observer
export class ArtistCard extends React.Component
{
    constructor(props) {
        super(props);
        this.handleHoverTrue = this.handleHoverTrue.bind(this);
        this.handleHoverFalse = this.handleHoverFalse.bind(this);
        this.state = {hover: false}
    }

    handleHoverTrue()
    {
        this.setState({hover: true});
    }

    handleHoverFalse()
    {
        this.setState({hover: false});
    }

    render()
    {
        const artist = this.props.artist;
        const placeholder = 'https://via.placeholder.com/300x300.png?text=placeholder';
        const imageUrl = artist.artistImageId ? '/art/' + artist.artistImageId : placeholder;

        const contextMenuId = 'artist=' + artist.artistName;
        const isContextMenuSelected = this.props.store.uiState.selectedContextMenuId === contextMenuId;

        const showActionMenu = this.state.hover || isContextMenuSelected;
        const tracks = showActionMenu ?
            this.props.store.appState.tracks.filter(track => track.artist === artist.artistName)
            : [];

        return (
            <div className="card" onMouseEnter={this.handleHoverTrue} onMouseLeave={this.handleHoverFalse}>
                <div className="card-image">
                    <figure className={"image is-square"}>
                        <img src={placeholder} data-src={imageUrl} alt="Placeholder image" className='lazyload'/>
                        {
                            showActionMenu &&
                            <ActionMenu tracks={tracks} contextMenuId={contextMenuId} style={{position:'absolute', top: '8px', right: '8px'}} />
                        }
                    </figure>
                </div>
                <div className="card-content" style={{padding: '.75rem'}}>
                    <div className="content">
                        <Link to={'/artist/' + artist.artistName}>{artist.artistName}</Link>
                    </div>
                </div>
            </div>
        );
    }
}