import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaServer,
  FaUser,
  FaSignOutAlt,
  FaSlidersH,
  FaMusic,
  FaUserCog,
  FaInfoCircle,
} from "react-icons/fa";
import superFetch from "./common/SuperFetch";
import { useUserStore } from "./common/UserContextProvider";
import { useAppStore } from "./common/AppContextProvider";
import { useWindowSize } from "react-use";

export default function Header() {
  const user = useUserStore((state) => state.user);
  const playlists = useAppStore((state) => state.playlists);
  const [isActive, setIsActive] = useState(false);
  const { width } = useWindowSize();

  const handleClickNavbarItem = (e) => {
    setIsActive(!isActive);
    e.target.blur();
  };

  function handleLogout() {
    superFetch("/logout", { method: "POST" }).then(
      () => (window.location.href = "/")
    );
    return false;
  }

  function playlistToNavLink(playlist) {
    return (
      <NavLink
        key={playlist.id}
        to={"/playlists/" + playlist.id}
        className={"navbar-item"}
        activeClassName={"is-active"}
        onClick={handleClickNavbarItem}
      >
        <span className="panel-icon">
          <FaMusic aria-hidden="true" />
        </span>
        {playlist.name}
      </NavLink>
    );
  }

  const isAdmin = user.admin;
  const customPlaylists = playlists
    ?.filter((playlist) => !playlist.favorites && !playlist.queue)
    ?.map((playlist) => {
      return playlistToNavLink(playlist);
    });

  // helps with issue where nav menu was not scrollable on mobile and items at the bottom were inaccessible.
  const navbarMenuStyle =
    width < 1024 ? { overflowY: "auto", height: "calc(100vh - 52px)" } : null;

  return (
    <nav
      className={"navbar is-success"}
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <div className="navbar-item">
          <img
            id="headerLogo"
            src={"/images/loon.png"}
            style={{ height: "28px" }}
            alt="Loon"
          />
        </div>

        <div
          role="button"
          tabIndex={0}
          className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
          aria-label="menu"
          aria-expanded="false"
          onClick={() => setIsActive(!isActive)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </div>
      </div>

      <div
        className={`navbar-menu ${isActive ? "is-active" : ""}`}
        id="navMenu"
        style={navbarMenuStyle}
      >
        <div className="navbar-start">
          <NavLink
            to="/search"
            activeClassName="is-active"
            className="navbar-item"
            onClick={handleClickNavbarItem}
          >
            Search
          </NavLink>
          <NavLink
            to="/favorites"
            activeClassName="is-active"
            className="navbar-item"
            onClick={handleClickNavbarItem}
          >
            Favorites
          </NavLink>
          <NavLink
            to="/queue"
            activeClassName="is-active"
            className="navbar-item"
            onClick={handleClickNavbarItem}
          >
            Queue
          </NavLink>
          <NavLink
            to="/artists"
            activeClassName="is-active"
            className="navbar-item"
            onClick={handleClickNavbarItem}
          >
            Artists
          </NavLink>
          <NavLink
            to="/albums"
            activeClassName="is-active"
            className="navbar-item"
            onClick={handleClickNavbarItem}
          >
            Albums
          </NavLink>
          {customPlaylists?.length === 0 && (
            <NavLink
              to="/playlists"
              activeClassName="is-active"
              className="navbar-item"
              onClick={handleClickNavbarItem}
            >
              Playlists
            </NavLink>
          )}
          {customPlaylists?.length !== 0 && (
            <div className={"navbar-item has-dropdown is-hoverable"}>
              <NavLink
                to="/playlists"
                activeClassName="is-active"
                className="navbar-link"
                onClick={handleClickNavbarItem}
              >
                Playlists
              </NavLink>
              <div className="navbar-dropdown">{customPlaylists}</div>
            </div>
          )}

          {isAdmin && (
            <div className={"navbar-item has-dropdown is-hoverable"}>
              <div className="navbar-link">Admin</div>
              <div className="navbar-dropdown">
                <NavLink
                  to={"/admin/systemSettings"}
                  className="navbar-item"
                  activeClassName="is-active"
                  onClick={handleClickNavbarItem}
                >
                  <span className="panel-icon">
                    <FaServer />
                  </span>
                  Manage System
                </NavLink>
                <NavLink
                  to={"/admin/users"}
                  className="navbar-item"
                  activeClassName="is-active"
                  onClick={handleClickNavbarItem}
                >
                  <span className="panel-icon">
                    <FaUser />
                  </span>
                  Manage Users
                </NavLink>
                <NavLink
                  to={"/admin/about"}
                  className="navbar-item"
                  activeClassName="is-active"
                  onClick={handleClickNavbarItem}
                >
                  <span className="panel-icon">
                    <FaInfoCircle />
                  </span>
                  About
                </NavLink>
              </div>
            </div>
          )}

          <div className={"navbar-item has-dropdown is-hoverable"}>
            <div className="navbar-link">Settings</div>
            <div className="navbar-dropdown">
              <NavLink
                to={"/settings/general"}
                className="navbar-item"
                activeClassName="is-active"
                onClick={handleClickNavbarItem}
              >
                <span className="panel-icon">
                  <FaUserCog />
                </span>
                General
              </NavLink>
              <NavLink
                to={"/settings/eq"}
                className="navbar-item"
                activeClassName="is-active"
                onClick={handleClickNavbarItem}
              >
                <span className="panel-icon">
                  <FaSlidersH rotation={90} />
                </span>
                Equalizer
              </NavLink>
            </div>
          </div>
        </div>
        <div className="navbar-end">
          <span className="navbar-item">
            <button onClick={handleLogout} className="button is-success">
              <span style={{ marginRight: "4px" }}>Sign Out</span>
              <span className="icon is-medium">
                <FaSignOutAlt />
              </span>
            </button>
          </span>
        </div>
      </div>
    </nav>
  );
}
