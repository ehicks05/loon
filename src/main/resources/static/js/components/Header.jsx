import React from 'react';
import {NavLink} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faServer, faUser, faSignOutAlt, faSlidersH, faMusic, faSun, faMoon, faUserCog, faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import {inject, observer} from "mobx-react";
import superFetch from "./SuperFetch";

@inject('store')
@observer
export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
        this.toggleDarkTheme = this.toggleDarkTheme.bind(this);
    }

    componentDidMount() {
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
    }

    handleLogout()
    {
        superFetch('/logout', {method: 'POST'})
            .then(response => location.href = '/');
        return false;
    }

    toggleDarkTheme() {
        this.props.store.uiState.toggleDarkTheme();
    }

    render()
    {
        const isAdmin = this.props.store.uiState.user.admin;

        const playlists = this.props.store.appState.playlists
            .filter(playlist => !playlist.favorites && !playlist.queue)
            .map((playlist) => {
                return (
                    <NavLink key={playlist.id} to={'/playlists/' + playlist.id} className={'navbar-item'} activeClassName={'is-active'}>
                        <span className="panel-icon">
                            <FontAwesomeIcon icon={faMusic} aria-hidden="true"/>
                        </span>
                        {playlist.name}
                    </NavLink>
                )
            });

        const innerHeight = this.props.store.uiState.windowDimensions.height;
        const navbarMenuHeight = innerHeight - 52;
        // helps with issue where nav menu was not scrollable on mobile and items at the bottom were inaccessible.
        const navbarMenuStyle = this.props.store.uiState.windowDimensions.width < 1024 ? {overflowY: 'auto', height: navbarMenuHeight + 'px'} : null;

        return (
            <nav className={"navbar " + (this.props.store.uiState.isDarkTheme ? ' is-dark ': ' is-success ')} role="navigation" aria-label="main navigation">
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
                        <a onClick={this.toggleDarkTheme} href={null} className={"navbar-item"}>
                            <span className="icon is-medium">
                                <FontAwesomeIcon icon={this.props.store.uiState.theme === 'cyborg' ? faSun : faMoon}/>
                            </span>
                        </a>
                        <a onClick={this.handleLogout} href={null} className="navbar-item">
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
}