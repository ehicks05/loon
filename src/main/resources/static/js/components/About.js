import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "./AppContextProvider";
import {UserContext} from "./UserContextProvider";

export default function About() {
    const [systemInfo, setSystemInfo] = useState({});
    const [versionInfo, setVersionInfo] = useState({});

    const appContext = useContext(AppContext);
    const userContext = useContext(UserContext);

    useEffect(() => {
        loadSystemInfo();
        loadVersionInfo();
    }, [])

    function getSelectedTrack() {
        return appContext.tracks && typeof appContext.tracks === 'object' ?
            appContext.tracks.find(track => track.id === userContext.user.userState.lastTrackId) : null; // todo rename lastTrackId
    }

    const selectedTrack = getSelectedTrack();

    function loadSystemInfo()
    {
        return fetch('/api/admin/systemInfo', {method: 'GET'})
            .then(response => response.json())
            .then(data => setSystemInfo(data));
    }

    function loadVersionInfo()
    {
        return fetch('/api/commitId', {method: 'GET'})
            .then(response => response.json())
            .then(data => setVersionInfo(data));
    }

    const versionInfoRows = Object.entries(versionInfo).map(value =>
        <tr>
            <td>{value[0]}</td>
            <td>{value[1]}</td>
        </tr>
    );

    const systemInfoRows = Object.entries(systemInfo).map(value =>
        <tr>
            <td>{value[0]}</td>
            <td>{value[1]}</td>
        </tr>
    );

    const selectedTrackInfoRows = selectedTrack ? Object.entries(selectedTrack).map(value =>
            <tr>
                <td>{value[0]}</td>
                <td>{value[1]}</td>
            </tr>
        )
        :
        null;

    return (
        <section className={'section'}>
            <div className={'subtitle'}>Git Info</div>
            <table className={'table is-narrow'}>
                <thead>
                    <th>Field</th>
                    <th>Value</th>
                </thead>
                <tbody>
                    {versionInfoRows}
                </tbody>
            </table>

            <div className={'subtitle'}>System Info</div>
            <table className={'table is-narrow'}>
                <thead>
                    <th>Field</th>
                    <th>Value</th>
                </thead>
                <tbody>
                    {systemInfoRows}
                </tbody>
            </table>

            <div className={'subtitle'}>Selected Track Info</div>
            <table className={'table is-narrow'}>
                <thead>
                    <th>Field</th>
                    <th>Value</th>
                </thead>
                <tbody>
                    {selectedTrackInfoRows}
                </tbody>
            </table>
        </section>
    );
}