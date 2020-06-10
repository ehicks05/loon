import React, {useContext} from 'react';
import {Link} from "react-router-dom";
import {AppContext} from "../../common/AppContextProvider";
import {UserContext} from "../../common/UserContextProvider";

export default function Playlists(props) {
    const appContext = useContext(AppContext);
    const userContext = useContext(UserContext);

    function deletePlaylist(playlistId)
    {
        if (window.confirm("Do you really want to delete this playlist?"))
            return appContext.deletePlaylist(playlistId);
    }

    const playlists = appContext.playlists
        .filter(playlist => !playlist.favorites && !playlist.queue)
        .map((playlist, index) => {
                const highlightClass = playlist.id === userContext.user.userState.lastPlaylistId ? ' playingHighlight' : '';

                return (<tr key={playlist.id} className={highlightClass}>
                    <td> {index + 1} </td>
                    <td>
                        <Link to={'/playlists/' + playlist.id} className="">
                            {playlist.name}
                        </Link>
                    </td>
                    <td className={'has-text-right'}>{playlist.playlistTracks.length}</td>
                    <td>
                        <span className='buttons'>
                            <Link className={"button is-small"} to={'/playlists/' + playlist.id + '/edit'}>
                                Edit
                            </Link>

                            <button className={"button is-small is-danger"} onClick={(e) => deletePlaylist(playlist.id)}>
                                Delete
                            </button>
                        </span>
                    </td>
                </tr>);
            }
        );

    return (
        <div>
            <section className={"section"}>
                <h1 className="title">Playlists</h1>
            </section>

            <section className="section">
                <table className={'table is-hoverable is-narrow is-striped'}>
                    <tbody>
                    <tr>
                        <td> </td>
                        <td>Name</td>
                        <td className={'has-text-right'}>Tracks</td>
                        <td> </td>
                    </tr>
                    {
                        playlists
                    }
                    </tbody>
                </table>
                <Link className={"button is-primary"} to={'/playlists/new'}>
                    New Playlist
                </Link>
            </section>
        </div>
    );
}