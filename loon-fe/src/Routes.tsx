import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useUserStore2 } from "./common/UserContextProvider";

import { GithubLogin, GithubLoginCallback } from "./GithubLogin";
import { Login } from "./Login";
import About from "./components/app/About";
import Album from "./components/app/Album";
import Albums from "./components/app/Albums";
import Artist from "./components/app/Artist";
import Artists from "./components/app/Artists";
import Playlist from "./components/app/Playlist";
import PlaylistBuilder from "./components/app/PlaylistBuilder";
import Playlists from "./components/app/Playlists";
import Search from "./components/app/Search";
import SystemSettings from "./components/app/admin/SystemSettings";
import UserSettings from "./components/app/admin/UserSettings";
import Eq from "./components/app/settings/Eq";
import GeneralSettings from "./components/app/settings/GeneralSettings";

export default function Routes() {
  const user = useUserStore2((state) => state.user);
  const isAdmin = user?.isAdmin;

  return (
    <>
      <Route exact path="/" render={() => <Redirect to="/search" />} />
      <Route exact path="/login/github" render={() => <GithubLogin />} />
      <Route exact path="/login" render={() => <Login />} />
      <AdminRoute
        exact
        path="/admin/systemSettings"
        appProps={{ isAdmin }}
        component={SystemSettings}
      />
      <AdminRoute
        exact
        path="/admin/users"
        appProps={{ isAdmin }}
        component={UserSettings}
      />
      <AdminRoute
        exact
        path="/admin/about"
        appProps={{ isAdmin }}
        component={About}
      />
      <Route
        exact
        path="/settings/general"
        render={() => <GeneralSettings />}
      />
      <Route exact path="/settings/eq" render={() => <Eq />} />
      <Route exact path="/albums" render={() => <Albums />} />
      <Route exact path="/artists" render={() => <Artists />} />
      <Route exact path="/artist/:artist" render={() => <Artist />} />
      <Route
        exact
        path="/artist/:artist/album/:album"
        render={(props) => <Album {...props} />}
      />
      <Route exact path="/search" render={() => <Search />} />
      <Route
        exact
        path="/favorites"
        render={(props) => <Playlist {...props} />}
      />
      <Route exact path="/queue" render={(props) => <Playlist {...props} />} />

      <Switch>
        <Route exact path="/playlists/new" render={() => <PlaylistBuilder />} />
        <Route
          exact
          path="/playlists/:id/edit"
          render={() => <PlaylistBuilder />}
        />

        <Route exact path="/library" render={() => <Playlists />} />
        <Route exact path="/playlists/:id" render={() => <Playlist />} />
      </Switch>
    </>
  );
}

function AdminRoute({ component: Component, appProps, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        appProps.isAdmin ? (
          <Component {...props} {...appProps} />
        ) : (
          <Redirect to={"/"} />
        )
      }
    />
  );
}
