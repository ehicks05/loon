import React, {useContext} from 'react';
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faSearch, faMusic, faUsers, faFolderOpen, faHeart, faList, faCompactDisc, faRedo} from '@fortawesome/free-solid-svg-icons'
import {AppContext} from "../../common/AppContextProvider";
import {UserContext} from "../../common/UserContextProvider";

export default function SidePanel() {
    const appContext = useContext(AppContext);
    const userContext = useContext(UserContext);
    const selectedPlaylistId = userContext.user.userState.selectedPlaylistId;

    if (!appContext || !appContext.playlists || !userContext)
        return <div>Loading...</div>;

    const defaultLinks = [
        {path: '/search', icon: faSearch, text: 'Search', currentlyPlaying: selectedPlaylistId === 0},
        {path: '/favorites', icon: faHeart, text: 'Favorites', currentlyPlaying: selectedPlaylistId === appContext.playlists.find(playlist => playlist.favorites).id},
        {path: '/queue', icon: faList, text: 'Queue', currentlyPlaying: selectedPlaylistId === appContext.playlists.find(playlist => playlist.queue).id},
        {path: '/artists', icon: faUsers, text: 'Artists'},
        {path: '/albums', icon: faCompactDisc, text: 'Albums'},
        {path: '/playlists', icon: faFolderOpen, text: 'Playlists'},
    ];

    const links = defaultLinks.map(link => linkToNavLink(link));

    let playlists = appContext.playlists
        .filter(playlist => !playlist.favorites && !playlist.queue)
        .map((playlist) => playlistToLink(playlist))
        .map((link) => linkToNavLink(link));

    function playlistToLink(playlist) {
        return {path: '/playlists/' + playlist.id, icon: faMusic, text: playlist.name, currentlyPlaying: playlist.id === selectedPlaylistId}
    }

    function linkToNavLink(link) {
        const currentlyPlayingIcon = link.currentlyPlaying ?
            <span className="panel-icon has-text-success" style={{marginLeft: '.75em'}} title={'Active Playlist'}>
                <FontAwesomeIcon icon={faRedo} spin aria-hidden="true"/>
            </span>
            : null;

        return (
            <NavLink key={link.path} to={link.path} exact className={'panel-block'} activeClassName={'is-active'}>
                <span className="panel-icon">
                    <FontAwesomeIcon icon={link.icon} aria-hidden="true"/>
                </span>
                {link.text}
                {currentlyPlayingIcon}
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