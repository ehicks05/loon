import React from 'react';
import {Link} from "react-router-dom";

export default class Playlists extends React.Component {
    constructor(props) {
        super(props);
    }

    render()
    {
        const playlists = this.props.playlists.map((playlist, index) => {
                const highlightClass = playlist.id === this.props.selectedPlaylistId ? ' playingHighlight' : '';

                return (<tr key={playlist.id} className={highlightClass}>
                    <td> {index + 1} </td>
                    <td>
                        <Link className={"button is-small"} to={'/playlists/' + playlist.id + '/edit'}>
                            Edit
                        </Link>
                    </td>
                    <td style={{width: '100%'}}>
                        <Link to={'/playlists/' + playlist.id} className="">
                            {playlist.name}
                        </Link>
                    </td>
                    <td> {playlist.trackIds.length} </td>
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
                                    <table className={'table is-fullwidth is-hoverable is-narrow is-striped'}>
                                        <tbody>
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