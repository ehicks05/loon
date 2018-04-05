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
                    <td> </td>
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
                    <div className="columns is-multiline is-centered">
                        <div className="column is-four-fifths">

                            <div>
                                <table className={'table is-fullwidth is-hoverable is-narrow is-striped'}>
                                    <tbody>
                                    {
                                        playlists
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </section>
            </div>);
    }
}