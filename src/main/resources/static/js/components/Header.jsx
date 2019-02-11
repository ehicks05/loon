import React from 'react';
import {NavLink} from "react-router-dom";
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer, faUser, faSignOutAlt, faSlidersH } from '@fortawesome/free-solid-svg-icons'

library.add(faServer, faUser, faSignOutAlt);

export default class Header extends React.Component {
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

    render()
    {
        const isAdmin = this.props.isAdmin;

        return (
            <nav className="navbar is-transparent is-primary" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <div className="navbar-item">
                        <img src={"/images/loon.png"} style={{height: '28px'}} alt="Loon" />
                    </div>

                    <a role="button" className="navbar-burger burger" data-target="navMenu">
                        <span />
                        <span />
                        <span />
                    </a>
                </div>

                <div className="navbar-menu" id="navMenu">
                    <div className="navbar-start">
                        <NavLink to='/library' activeClassName='is-active' className="navbar-item">Library</NavLink>
                        <NavLink to='/playlists' activeClassName='is-active' className="navbar-item">Playlists</NavLink>

                        {
                            isAdmin &&
                            <div className={"navbar-item has-dropdown is-hoverable"}>
                                <div className="navbar-link">Admin</div>
                                <div className="navbar-dropdown is-boxed">
                                    <NavLink to={'/admin/systemSettings'} className="navbar-item" activeClassName='is-active'>
                                        <span className="icon is-medium has-text-info">
                                            <FontAwesomeIcon icon={faServer}/>
                                        </span>
                                        Manage System
                                    </NavLink>
                                    <NavLink to={'/admin/users'} className="navbar-item" activeClassName='is-active'>
                                        <span className="icon is-medium has-text-info">
                                            <FontAwesomeIcon icon={faUser}/>
                                        </span>
                                        Manage Users
                                    </NavLink>
                                </div>
                            </div>
                        }

                        <div className={"navbar-item has-dropdown is-hoverable"}>
                            <div className="navbar-link">Settings</div>
                            <div className="navbar-dropdown is-boxed">
                                <NavLink to={'/settings/eq'} className="navbar-item" activeClassName='is-active'>
                                        <span className="icon is-medium has-text-info">
                                            <FontAwesomeIcon icon={faSlidersH} rotation={90}/>
                                        </span>
                                    Equalizer
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="navbar-end">
                        <a href='/logout' className="navbar-item">
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