import React from 'react';
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch, faMusic, faUsers, faFolderOpen, faHeart, faList, faCompactDisc} from '@fortawesome/free-solid-svg-icons'
import {inject, observer} from "mobx-react";

@inject('store')
@observer
export default class SidePanel extends React.Component {
    render()
    {
        const playlists = this.props.store.appState.playlists
            .filter(playlist => !playlist.favorites && !playlist.queue)
            .map((playlist) => {
            return (
                <NavLink key={playlist.id} to={'/playlists/' + playlist.id} className={'panel-block'}
                         activeClassName={'is-active'}
                         // isActive={() => playlist.id === selectedPlaylistId}
                >
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={faMusic} aria-hidden="true"/>
                    </span>
                    {playlist.name}
                </NavLink>
            )
        });

        return (
            <nav className={'panel'} style={{maxWidth: '250px'}}>
                <NavLink to={'/search'} className="panel-block" activeClassName="is-active">
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={faSearch} aria-hidden="true" />
                    </span>
                    Search
                </NavLink>
                <NavLink to={'/favorites'} className="panel-block" activeClassName="is-active">
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={faHeart} aria-hidden="true" />
                    </span>
                    Favorites
                </NavLink>
                <NavLink to={'/queue'} className="panel-block" activeClassName="is-active">
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={faList} aria-hidden="true" />
                    </span>
                    Queue
                </NavLink>
                <NavLink to={'/artists'} className="panel-block" activeClassName="is-active">
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={faUsers} aria-hidden="true" />
                    </span>
                    Artists
                </NavLink>
                <NavLink to={'/albums'} className="panel-block" activeClassName="is-active">
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={faCompactDisc} aria-hidden="true" />
                    </span>
                    Albums
                </NavLink>
                <NavLink to={'/playlists'} className="panel-block" activeClassName="is-active" exact={true}>
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={faFolderOpen} aria-hidden="true" />
                    </span>
                    Playlists
                </NavLink>
                {
                    playlists
                }
            </nav>
        );
    }
}