import React from 'react';
import {Link, NavLink} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch, faServer, faMusic, faUsers, faFolderOpen, faListUl} from '@fortawesome/free-solid-svg-icons'

export default class SidePanel extends React.Component {
    componentDidMount()
    {

    }

    render()
    {
        const selectedPlaylistId = this.props.selectedPlaylistId;

        const playlists = this.props.playlists.map((playlist) => {
            return (
                <NavLink key={playlist.id} to={'/playlists/' + playlist.id} className={'panel-block'}
                         activeClassName={'is-active'}
                         isActive={() => playlist.id === selectedPlaylistId}>
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={faMusic} aria-hidden="true"/>
                    </span>
                    {playlist.name}
                </NavLink>
            )
        });

        return (
            <nav className={'panel'} style={{}}>
                <NavLink to={'/search'} className="panel-block" activeClassName="is-active">
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={faSearch} aria-hidden="true" />
                    </span>
                    Search
                </NavLink>
                <NavLink to={'/library'} className="panel-block" activeClassName="is-active" isActive={() => selectedPlaylistId === 0}>
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={faServer} aria-hidden="true" />
                    </span>
                    Library
                </NavLink>
                <NavLink to={'/artists'} className="panel-block" activeClassName="is-active">
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={faUsers} aria-hidden="true" />
                    </span>
                    Artists
                </NavLink>
                <NavLink to={'/albums'} className="panel-block" activeClassName="is-active">
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={faFolderOpen} aria-hidden="true" />
                    </span>
                    Albums
                </NavLink>
                <NavLink to={'/playlists'} className="panel-block" activeClassName="is-active">
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