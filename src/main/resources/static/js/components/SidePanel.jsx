import React from 'react';
import {Link, NavLink} from "react-router-dom";
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faServer, faUser, faSignOutAlt, faSearch, faBook, faCodeBranch, faMusic} from '@fortawesome/free-solid-svg-icons'

library.add(faServer, faUser, faSignOutAlt);

export default class SidePanel extends React.Component {
    componentDidMount()
    {

    }

    render()
    {
        const selectedPlaylistId = this.props.selectedPlaylistId;

        const playlists = this.props.playlists.map((playlist) => {
            const selected = playlist.id === selectedPlaylistId;
            const className = selected ? 'panel-block is-active' : 'panel-block';
            return (
                <Link key={playlist.id} to={'/playlists/' + playlist.id} className={className}>
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={faMusic} aria-hidden="true"/>
                    </span>
                    {playlist.name}
                </Link>
            )
        });

        return (
            <nav className={'panel'} style={{}}>
                <p className="panel-heading">
                    Loon
                </p>
                <Link to={'/search'} className="panel-block">
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={faSearch} aria-hidden="true" />
                    </span>
                    Search
                </Link>
                <Link to={'/library'} className={"panel-block" + (selectedPlaylistId === 0 ? ' is-active' : '')}>
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={faBook} aria-hidden="true" />
                    </span>
                    Library
                </Link>
                <div className="panel-block">
                    Playlists
                </div>
                {
                    playlists
                }
            </nav>
        );
    }
}