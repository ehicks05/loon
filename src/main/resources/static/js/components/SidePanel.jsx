import React from 'react';
import {Link, NavLink} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch, faServer, faMusic, faUsers, faFolderOpen, faListUl, faHeart, faList, faCompactDisc, faBoxOpen, faBox} from '@fortawesome/free-solid-svg-icons'

export default class SidePanel extends React.Component {
    componentDidMount()
    {

    }

    render()
    {
        const selectedPlaylistId = this.props.selectedPlaylistId;

        const playlists = this.props.playlists
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
                <NavLink to={'/library'} className="panel-block" activeClassName="is-active" isActive={() => selectedPlaylistId === 0}>
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={faBox} aria-hidden="true" />
                    </span>
                    Library
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
                        <FontAwesomeIcon icon={faListUl} aria-hidden="true" />
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