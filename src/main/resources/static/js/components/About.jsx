import React from 'react';
import {inject, observer} from "mobx-react";

@inject('store')
@observer
export default class Album extends React.Component {

    render()
    {
        const gitInfo = this.props.store.appState.versionInfo;
        const gitInfoRows = Object.entries(gitInfo).map(value =>
            <tr>
                <td>{value[0]}</td>
                <td>{value[1]}</td>
            </tr>
        );

        const systemInfo = this.props.store.appState.systemInfo;
        const systemInfoRows = Object.entries(systemInfo).map(value =>
            <tr>
                <td>{value[0]}</td>
                <td>{value[1]}</td>
            </tr>
        );

        const selectedTrack = this.props.store.uiState.selectedTrack;
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
                        {gitInfoRows}
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
}