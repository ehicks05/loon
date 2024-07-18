import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useUserStore } from "./common/UserContextProvider";

import SystemSettings from "./components/app/admin/SystemSettings";
// import Playlist from "./components/app/Playlist";
import Playlists from "./components/app/Playlists";
import GeneralSettings from "./components/app/settings/GeneralSettings";
import Eq from "./components/app/settings/Eq";
import PlaylistBuilder from "./components/app/PlaylistBuilder";
import UserSettings from "./components/app/admin/UserSettings";
import About from "./components/app/About";
import Artists from "./components/app/Artists";
import Albums from "./components/app/Albums";
import Artist from "./components/app/Artist";
import Search from "./components/app/Search";
import Album from "./components/app/Album";

export default function Routes() {
  const user = useUserStore((state) => state.user);
  const isAdmin = user.admin;

  return (
    <>
      <Route exact path="/" render={() => <Redirect to="/search" />} />
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
      <Route
        exact
        path="/artist/:artist"
        render={(props) => <Artist {...props} />}
      />
      <Route
        exact
        path="/artist/:artist/album/:album"
        render={(props) => <Album {...props} />}
      />
      <Route exact path="/search" render={(props) => <Search {...props} />} />
      {/* <Route
        exact
        path="/favorites"
        render={(props) => <Playlist {...props} />}
      />
      <Route exact path="/queue" render={(props) => <Playlist {...props} />} /> */}

      <Switch>
        <Route
          exact
          path="/playlists/new"
          render={(props) => <PlaylistBuilder {...props} />}
        />
        <Route
          exact
          path="/playlists/:id/edit"
          render={(props) => <PlaylistBuilder {...props} />}
        />

        <Route exact path="/playlists" render={() => <Playlists />} />
        {/* <Route
          exact
          path="/playlists/:id"
          render={(props) => <Playlist {...props} />}
        /> */}
      </Switch>
    </>
  );
}

function AdminRoute({ component: C, appProps, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        appProps.isAdmin ? (
          <C {...props} {...appProps} />
        ) : (
          <Redirect to={"/"} />
        )
      }
    />
  );
}
