import React, {Suspense, lazy, useContext} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom'
import {UserContext} from "./UserContextProvider";

const SystemSettings = lazy(() => import('./SystemSettings'));
const Playlist = lazy(() => import('./Playlist'));
const Playlists = lazy(() => import('./Playlists'));
const GeneralSettings = lazy(() => import('./GeneralSettings'));
const Eq = lazy(() => import('./Eq'));
const PlaylistBuilder = lazy(() => import('./PlaylistBuilder'));

const UserSettings = lazy(() => import('./UserSettings'));
const About = lazy(() => import('./About'));
const Artists = lazy(() => import('./Artists'));
const Albums = lazy(() => import('./Albums'));
const Artist = lazy(() => import('./Artist'));
const Search = lazy(() => import('./Search'));
const Album = lazy(() => import('./Album'));

export default function Routes(props) {
    const userContext = useContext(UserContext);
    const isAdmin = userContext.user.admin;

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Route exact path='/'                               render={() => <Redirect to='/search' /> } />
            <AdminRoute exact path='/admin/systemSettings' appProps={{isAdmin}} component={SystemSettings}/>
            <AdminRoute exact path='/admin/users'          appProps={{isAdmin}} component={UserSettings}/>
            <AdminRoute exact path='/admin/about'          appProps={{isAdmin}} component={About}/>
            <Route exact path='/settings/general'               render={() => <GeneralSettings />}/>
            <Route exact path='/settings/eq'                    render={() => <Eq />}/>
            <Route exact path='/albums'                         render={() => <Albums />}/>
            <Route exact path='/artists'                        render={() => <Artists />}/>
            <Route exact path='/artist/:artist'                 render={(props) => <Artist {...props} />}/>
            <Route exact path='/artist/:artist/album/:album'    render={(props) => <Album {...props} />} />
            <Route exact path='/search'                         render={(props) => <Search {...props} />} />
            <Route exact path='/favorites'                      render={(props) => <Playlist {...props} />} />
            <Route exact path='/queue'                          render={(props) => <Playlist {...props} />} />

            <Switch>
                <Route exact path='/playlists/new'              render={(props) => <PlaylistBuilder {...props} />} />
                <Route exact path='/playlists/:id/edit'         render={(props) => <PlaylistBuilder {...props} />} />

                <Route exact path='/playlists'                  render={() => <Playlists />} />
                <Route exact path='/playlists/:id'              render={(props) => <Playlist {...props} />} />
            </Switch>
        </Suspense>
    );
}

function AdminRoute({ component: C, appProps, ...rest }) {
    return (
        <Route
            {...rest}
            render={props =>
                appProps.isAdmin
                    ? <C {...props} {...appProps} />
                    : <Redirect
                        to={'/'}
                    />}
        />
    );
}