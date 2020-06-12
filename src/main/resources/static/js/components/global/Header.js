import React, {useContext, useEffect} from 'react';
import {NavLink} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faServer, faUser, faSignOutAlt, faSlidersH, faMusic, faUserCog, faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import superFetch from "../../common/SuperFetch";
import {useMediaQuery} from "../../common/MediaQueryHook";
import {UserContext} from "../../common/UserContextProvider";
import {AppContext} from "../../common/AppContextProvider";

export default function Header() {
    const userContext = useContext(UserContext);
    const appContext = useContext(AppContext);

    useEffect(() => {
        // Get all "navbar-burger" elements
        var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

        // Check if there are any navbar burgers
        if ($navbarBurgers.length > 0) {

            // Add a click event on each of them
            $navbarBurgers.forEach(function ($el) {
                $el.addEventListener('click', function () {

                    // Get the target from the "data-target" attribute
                    var target = $el.dataset.target;
                    var $target = document.getElementById(target);

                    // Toggle the class on both the "navbar-burger" and the "navbar-menu"
                    $el.classList.toggle('is-active');
                    $target.classList.toggle('is-active');

                });
            });

            let navbarLinks = Array.prototype.slice.call(document.querySelectorAll('#navMenu a'), 0);
            navbarLinks.forEach(function ($el) {
                $el.addEventListener('click', function () {
                    document.querySelector('.navbar-burger').click();
                });
            });
        }
    }, []);

    function handleLogout()
    {
        superFetch('/logout', {method: 'POST'})
            .then(() => location.href = '/');
        return false;
    }

    function playlistToNavLink(playlist)
    {
        return (
            <NavLink key={playlist.id} to={'/playlists/' + playlist.id} className={'navbar-item'} activeClassName={'is-active'}>
                <span className="panel-icon">
                    <FontAwesomeIcon icon={faMusic} aria-hidden="true"/>
                </span>
                {playlist.name}
            </NavLink>
        )
    }

    const isAdmin = userContext.user.admin;
    const playlists = appContext.playlists
        .filter(playlist => !playlist.favorites && !playlist.queue)
        .map(playlist => {return playlistToNavLink(playlist)});

    const isLessThan1024Width = useMediaQuery('(max-width: 1024px)');

    // helps with issue where nav menu was not scrollable on mobile and items at the bottom were inaccessible.
    const navbarMenuStyle = isLessThan1024Width ? {overflowY: 'auto', height: 'calc(100vh - 52px)'} : null;

    return (
        <nav className={"navbar is-success"} role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <div className="navbar-item">
                    <img id='headerLogo' src={"/images/loon.png"} style={{height: '28px'}} alt="Loon" />
                </div>

                <a role="button" className="navbar-burger burger" data-target="navMenu">
                    <span />
                    <span />
                    <span />
                </a>
            </div>

            <div className="navbar-menu" id="navMenu" style={navbarMenuStyle}>
                <div className="navbar-start">
                    <NavLink to='/search' activeClassName='is-active' className="navbar-item">Search</NavLink>
                    <NavLink to='/favorites' activeClassName='is-active' className="navbar-item">Favorites</NavLink>
                    <NavLink to='/queue' activeClassName='is-active' className="navbar-item">Queue</NavLink>
                    <NavLink to='/artists' activeClassName='is-active' className="navbar-item">Artists</NavLink>
                    <NavLink to='/albums' activeClassName='is-active' className="navbar-item">Albums</NavLink>
                    <div className={"navbar-item has-dropdown is-hoverable"}>
                        <NavLink to='/playlists' activeClassName='is-active' className="navbar-link">
                            Playlists
                        </NavLink>
                        <div className="navbar-dropdown">
                            {playlists}
                        </div>
                    </div>

                    {
                        isAdmin &&
                        <div className={"navbar-item has-dropdown is-hoverable"}>
                            <div className="navbar-link">Admin</div>
                            <div className="navbar-dropdown">
                                <NavLink to={'/admin/systemSettings'} className="navbar-item" activeClassName='is-active'>
                                        <span className="panel-icon">
                                            <FontAwesomeIcon icon={faServer}/>
                                        </span>
                                    Manage System
                                </NavLink>
                                <NavLink to={'/admin/users'} className="navbar-item" activeClassName='is-active'>
                                        <span className="panel-icon">
                                            <FontAwesomeIcon icon={faUser}/>
                                        </span>
                                    Manage Users
                                </NavLink>
                                <NavLink to={'/admin/about'} className="navbar-item" activeClassName='is-active'>
                                        <span className="panel-icon">
                                            <FontAwesomeIcon icon={faInfoCircle}/>
                                        </span>
                                    About
                                </NavLink>
                            </div>
                        </div>
                    }

                    <div className={"navbar-item has-dropdown is-hoverable"}>
                        <div className="navbar-link">Settings</div>
                        <div className="navbar-dropdown">
                            <NavLink to={'/settings/general'} className="navbar-item" activeClassName='is-active'>
                                    <span className="panel-icon">
                                        <FontAwesomeIcon icon={faUserCog} />
                                    </span>
                                General
                            </NavLink>
                            <NavLink to={'/settings/eq'} className="navbar-item" activeClassName='is-active'>
                                    <span className="panel-icon">
                                        <FontAwesomeIcon icon={faSlidersH} rotation={90}/>
                                    </span>
                                Equalizer
                            </NavLink>
                        </div>
                    </div>
                </div>
                <div className="navbar-end">
                    <a onClick={handleLogout} href={null} className="navbar-item">
                        <span style={{marginRight: '4px'}}>Sign Out</span>
                        <span className="icon is-medium">
                                <FontAwesomeIcon icon={faSignOutAlt}/>
                            </span>
                    </a>
                </div>
            </div>
        </nav>
    );
}