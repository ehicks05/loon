import React, {useContext, useEffect, useState} from 'react';
import 'bulma-switch/dist/css/bulma-switch.min.css'
import {UserContext} from "./UserContextProvider";

export default function GeneralSettings() {
    const userContext = useContext(UserContext);

    const [transcodeQuality, setTranscodeQuality] = useState('');

    useEffect(() => {
        fetch('/api/systemSettings/transcodeQuality', {method: 'GET'})
            .then(response => response.json())
            .then(data => setTranscodeQuality(data));
    }, []);

    function setTranscode(e)
    {
        userContext.setTranscode(e.target.checked);
    }

    return (
        <div>
            <section className={"section"}>
                <h1 className="title">Settings</h1>
                <h2 className="subtitle">
                    General Settings
                </h2>
            </section>
            <section className="section">
                <form id="frmGeneralSettings" method="post" action="">
                    <table className={'table'} style={{padding: '8px', maxWidth: '80%', borderCollapse: 'separate'}}>
                        <tbody>
                        <tr>
                            <td style={{padding: '10px'}} className={'has-text-centered'}>
                                <div className="field">
                                    <input type="checkbox" className="switch is-rounded" id="transcode" name="transcode" checked={userContext.user.userState.transcode} onChange={(e) => setTranscode(e)} />
                                    <label htmlFor="transcode">Transcode all tracks to mp3 v{transcodeQuality}</label>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </form>
            </section>
        </div>
    );
}