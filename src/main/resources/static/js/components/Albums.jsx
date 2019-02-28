import React from 'react';
import {Link} from "react-router-dom";
import {inject, observer} from "mobx-react";
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';
import ActionMenu from "./ActionMenu.jsx";

@inject('store')
@observer
export default class Albums extends React.Component {
    constructor(props) {
        super(props);
    }

    render()
    {
        let tracks = this.props.store.appState.tracks;
        if (this.props.tracks)
            tracks = this.props.tracks;

        const hideTitle = this.props.hideTitle;

        let albums = [...new Set(tracks.map(track => {return JSON.stringify({albumArtist: track.albumArtist, album: track.album, albumImageId: track.albumImageId})}))];
        albums = albums.map(album => JSON.parse(album));
        albums = albums.sort((a1, a2) => {
            if (a1.albumArtist < a2.albumArtist) return -1;
            if (a1.albumArtist > a2.albumArtist) return 1;
            return 0;
        });

        const albumItems = albums.map((album) => {
            // const album = JSON.parse(albumJson);
            return <AlbumCard key={album.albumArtist + '-' + album.album} album={album} />
        });

        const windowWidth = this.props.store.uiState.windowDimensions.width;
        const gridItemWidth = windowWidth <= 768 ? 150 :
            windowWidth < 1024 ? 175 :
                windowWidth < 1216 ? 200 :
                    windowWidth < 1408 ? 225 :
                        250;

        return (
            <div>
                {!hideTitle && <div className="title" style={{padding: '.5rem'}}>{albums.length} Albums:</div>}
                <div id="playlist" className="playlist" style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{padding: '.5rem', flex: '1', flexGrow: '1'}}>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(' + gridItemWidth + 'px, 1fr))', gridGap: '.5em'}}>
                            {albumItems}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

@inject('store')
@observer
export class AlbumCard extends React.Component
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
        const album = this.props.album;
        const placeholder = 'https://via.placeholder.com/600x600.png?text=' + album.albumArtist + ' - ' + album.album;
        const imageUrl = album.albumImageId ? '/art/' + album.albumImageId : placeholder;

        const contextMenuId = 'artist=' + album.albumArtist + ',album=' + album.album;
        const isContextMenuSelected = this.props.store.uiState.selectedContextMenuId === contextMenuId;

        const showActionMenu = this.state.hover || isContextMenuSelected;
        const tracks = showActionMenu ?
            this.props.store.appState.tracks.filter(track => track.albumArtist === album.albumArtist && track.album === album.album)
            : [];

        const displayArtist = album.albumArtist.length > 15 ? album.albumArtist.substring(0, 32) : album.albumArtist;
        const displayAlbum = album.album.length > 15 ? album.album.substring(0, 32) : album.album;
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
                        <Link to={'/artist/' + album.albumArtist}>
                            <span title={album.albumArtist}>{displayArtist}</span>
                        </Link>
                        &nbsp;-&nbsp;
                        <Link to={'/artist/' + album.albumArtist + '/album/' + album.album}>
                            <span title={album.albumArtist + ' - ' + album.album}>{displayAlbum}</span>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}