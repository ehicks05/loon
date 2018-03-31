import React from 'react';

export default class Playlists extends React.Component {
    constructor(props) {
        super(props);
        const self = this;

        let xhr = new XMLHttpRequest();
        xhr.open('GET', '/loon/view/playlists?action=form', false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                self.state = {playlists: JSON.parse(this.responseText)};
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
    }

    render()
    {
        const playlists = this.state.playlists;

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
                                        playlists.map((playlist, index) =>
                                            <tr key={playlist.id} >
                                                <td> {index + 1} </td>
                                                <td style={{width: '100%'}}> {playlist.name} </td>
                                                <td> {playlist.size} </td>
                                            </tr>
                                        )
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