import React, {useContext, useEffect} from 'react';
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch, faMusic, faUsers, faFolderOpen, faHeart, faList, faCompactDisc} from '@fortawesome/free-solid-svg-icons'
import {AppContext} from "./AppContextProvider";

export default function SidePanel(props) {
    const appContext = useContext(AppContext);

    const defaultLinks = [
        {path: '/search', icon: faSearch, text: 'Search'},
        {path: '/favorites', icon: faHeart, text: 'Favorites'},
        {path: '/queue', icon: faList, text: 'Queue'},
        {path: '/artists', icon: faUsers, text: 'Artists'},
        {path: '/albums', icon: faCompactDisc, text: 'Albums'},
        {path: '/playlists', icon: faFolderOpen, text: 'Playlists'},
    ];

    const links = defaultLinks.map(link => linkToNavLink(link));

    if (!appContext || !appContext.playlists)
        return <div>Loading...</div>;

    let playlists = appContext.playlists
        .filter(playlist => !playlist.favorites && !playlist.queue)
        .map((playlist) => playlistToLink(playlist))
        .map((link) => linkToNavLink(link));

    function playlistToLink(playlist) {
        return {path: '/playlists/' + playlist.id, icon: faMusic, text: playlist.name}
    }

    function linkToNavLink(link) {
        return (
            <NavLink key={link.path} to={link.path} className={'panel-block'} activeClassName={'is-active'}>
                    <span className="panel-icon">
                        <FontAwesomeIcon icon={link.icon} aria-hidden="true"/>
                    </span>
                {link.text}
            </NavLink>
        )
    }

    return (
        <nav className={'panel'} style={{maxWidth: '250px'}}>
            {links}
            {playlists}
        </nav>
    );
}