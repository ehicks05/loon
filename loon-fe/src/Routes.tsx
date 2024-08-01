import type { Component } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { useUserStore2 } from "./common/UserContextProvider";

import About from "@/app/About";
import Album from "@/app/Album";
import Albums from "@/app/Albums";
import Artist from "@/app/Artist";
import Artists from "@/app/Artists";
import { GithubLogin } from "@/app/GithubLogin";
import Playlist from "@/app/Playlist";
import PlaylistBuilder from "@/app/PlaylistBuilder";
import Playlists from "@/app/Playlists";
import Search from "@/app/Search";
import SystemSettings from "@/app/admin/SystemSettings";
import UserSettings from "@/app/admin/UserSettings";
import Eq from "@/app/settings/Eq";
import GeneralSettings from "@/app/settings/GeneralSettings";
import { Login } from "./app/Login";
import type { User } from "./common/types";

export default function Routes() {
  const user = useUserStore2((state) => state.user);

  return (
    <>
      <Route exact path="/" render={() => <Redirect to="/search" />} />
      <Route exact path="/login/github" render={() => <GithubLogin />} />
      <Route exact path="/login" render={() => <Login />} />
      <AdminRoute
        exact
        path="/admin/systemSettings"
        user={user}
        component={SystemSettings}
      />
      <AdminRoute
        exact
        path="/admin/users"
        user={user}
        component={UserSettings}
      />
      <AdminRoute exact path="/admin/about" user={user} component={About} />
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
      <Route exact path="/favorites" render={() => <Playlist />} />
      <Route exact path="/queue" render={() => <Playlist />} />

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

function AdminRoute({
  component: Component,
  user,
  ...rest
}: { component: Component; user?: User }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        user.isAdmin ? <Component {...props} /> : <Redirect to={"/"} />
      }
    />
  );
}
