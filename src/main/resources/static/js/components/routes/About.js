import React, {useContext} from 'react';
import {AppContext} from "../../common/AppContextProvider";
import {UserContext} from "../../common/UserContextProvider";

export default function About() {
    const appContext = useContext(AppContext);
    const userContext = useContext(UserContext);

    function getSelectedTrack() {
        return appContext.tracks && typeof appContext.tracks === 'object' ?
            appContext.tracks.find(track => track.id === userContext.user.userState.selectedTrackId) : null;
    }

    const selectedTrack = getSelectedTrack();

    const selectedTrackInfoRows = selectedTrack ? Object.entries(selectedTrack).map(value =>
            <tr key={value[0]}>
                <td>{value[0]}</td>
                <td>{value[1]}</td>
            </tr>
        ) : null;

    return (
        <section className={'section'}>
            <div className={'subtitle'}>Selected Track Info</div>
            <table className={'table is-narrow'}>
                <thead>
                <tr>
                    <th>Field</th>
                    <th>Value</th>
                </tr>
                </thead>
                <tbody>
                    {selectedTrackInfoRows}
                </tbody>
            </table>
        </section>
    );
}