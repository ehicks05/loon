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
import Eq from "@/app/settings/EqPage";
import GeneralSettings from "@/app/settings/GeneralSettings";
import { Redirect, Route, Switch } from "react-router-dom";
import { Login } from "./app/Login";
import { trpc } from "./utils/trpc";

export default function Routes() {
  const { data: user } = trpc.misc.me.useQuery();
  const isAdmin = user?.isAdmin || false;

  return (
    <>
      <Switch>
        <Route
          exact
          path="/admin/systemSettings"
          render={() => (isAdmin ? <SystemSettings /> : <Redirect to={"/"} />)}
        />
        <Route
          exact
          path="/admin/users"
          render={() => (isAdmin ? <UserSettings /> : <Redirect to={"/"} />)}
        />
        <Route
          exact
          path="/admin/about"
          render={() => (isAdmin ? <About /> : <Redirect to={"/"} />)}
        />

        <Route exact path="/" render={() => <Redirect to="/search" />} />
        <Route exact path="/login/github">
          <GithubLogin />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/settings/general">
          <GeneralSettings />
        </Route>
        <Route exact path="/settings/eq">
          <Eq />
        </Route>
        <Route exact path="/albums">
          <Albums />
        </Route>
        <Route exact path="/artists">
          <Artists />
        </Route>
        <Route exact path="/artists/:artist">
          <Artist />
        </Route>
        <Route exact path="/artists/:artist/albums/:album">
          <Album />
        </Route>
        <Route exact path="/search">
          <Search />
        </Route>

        <Route exact path="/library">
          <Playlists />
        </Route>
        <Route exact path="/playlists/new">
          <PlaylistBuilder />
        </Route>
        <Route exact path="/playlists/:id">
          <Playlist />
        </Route>
        <Route exact path="/playlists/:id/edit">
          <PlaylistBuilder />
        </Route>
      </Switch>
    </>
  );
}
