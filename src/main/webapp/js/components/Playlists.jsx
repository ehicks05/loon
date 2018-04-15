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
        if (window.confirm("Do you really want to delete this playlist?")) {
            let url = '/loon/view/' + 'playlists?action=delete&id=' + playlistId;

            let xhr = new XMLHttpRequest();
            xhr.open('GET', url, false);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    self.props.onUpdatePlaylists();
                }
                else {
                    console.log('Request failed.  Returned status of ' + xhr.status);
                }
            };
            xhr.send();
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
                    <td className={'has-text-right'}>{playlist.trackIds.length}</td>
                    <td>
                        <Link className={"button is-small"} to={'/playlists/' + playlist.id + '/edit'}>
                            Edit
                        </Link>
                    </td>
                    <td>
                        <button className={"button is-small is-danger"} onClick={(e) => this.delete(playlist.id)}>
                            Delete
                        </button>
                    </td>
                </tr>);
            }
        );

        return (
            <div>
                <section className={"section"}>
                    <div className="container">
                        <h1 className="title">Playlists</h1>
                    </div>
                </section>

                <section className="section">
                    <div className="container">
                        <div className="columns is-multiline is-centered">
                            <div className="column">

                                <div>
                                    <table className={'table is-hoverable is-narrow is-striped'}>
                                        <tbody>
                                            <tr>
                                                <td> </td>
                                                <td>Name</td>
                                                <td className={'has-text-right'}>Tracks</td>
                                                <td> </td>
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
                                </div>
                            </div>
                        </div>
                    </div>

                </section>
            </div>);
    }
}