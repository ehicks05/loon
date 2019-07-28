import React from 'react';
import {inject, observer} from "mobx-react";
import ActionMenu from "./ActionMenu";
import {Link} from "react-router-dom";
import 'lazysizes';
import 'lazysizes/plugins/attrchange/ls.attrchange';

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