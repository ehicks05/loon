import { Redirect, Route, Switch } from "react-router-dom";
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
import { Login } from "./app/Login";
import { trpc } from "./utils/trpc";

export default function Routes() {
  const { data: user } = trpc.misc.me.useQuery();
  const isAdmin = user?.isAdmin || false;

  return (
    <>
      {/* ADMIN */}
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
      <Route exact path="/login/github" render={() => <GithubLogin />} />
      <Route exact path="/login" render={() => <Login />} />
      <Route
        exact
        path="/settings/general"
        render={() => <GeneralSettings />}
      />
      <Route exact path="/settings/eq" render={() => <Eq />} />
      <Route exact path="/albums" render={() => <Albums />} />
      <Route exact path="/artists" render={() => <Artists />} />
      <Route exact path="/artists/:artist" render={() => <Artist />} />
      <Route
        exact
        path="/artists/:artist/albums/:album"
        render={() => <Album />}
      />
      <Route exact path="/search" render={() => <Search />} />

      <Switch>
        <Route exact path="/library" render={() => <Playlists />} />
        <Route exact path="/playlists/new" render={() => <PlaylistBuilder />} />
        <Route exact path="/playlists/:id" render={() => <Playlist />} />
        <Route
          exact
          path="/playlists/:id/edit"
          render={() => <PlaylistBuilder />}
        />
      </Switch>
    </>
  );
}
