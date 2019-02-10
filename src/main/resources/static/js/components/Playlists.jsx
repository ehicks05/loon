import React from 'react';
import {Link} from "react-router-dom";

export default class Playlists extends React.Component {
    constructor(props) {
        super(props);
        this.delete = this.delete.bind(this);
    }

    delete(playlistId)
    {
        const self = this;
        if (window.confirm("Do you really want to delete this playlist?"))
        {
            return fetch('/api/playlists/' + playlistId, {
                method: 'delete'
            }).then(data => {
                console.log(data);
                self.props.onUpdatePlaylists();
            });
        }
    }

    render()
    {
        const playlists = this.props.playlists.map((playlist, index) => {
                const highlightClass = playlist.id === this.props.selectedPlaylistId ? ' playingHighlight' : '';

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

                            <button className={"button is-small is-danger"} onClick={(e) => this.delete(playlist.id)}>
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
            </div>);
    }
}