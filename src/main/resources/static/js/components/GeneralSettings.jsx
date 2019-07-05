import React from 'react';
import {inject, observer} from "mobx-react";
import 'bulma-switch/dist/css/bulma-switch.min.css'

@inject('store')
@observer
export default class GeneralSettings extends React.Component {
    constructor(props) {
        super(props);

        this.save = this.save.bind(this);
    }

    save(e)
    {
        const formData = new FormData(document.getElementById('frmGeneralSettings'));
        this.props.store.uiState.updateTranscode(formData.get('transcode') === 'on');
    }

    render()
    {
        const userState = this.props.store.uiState.user.userState;
        const cellStyle = {padding: '10px'};

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
                                <td style={cellStyle} className={'has-text-centered'}>
                                    <div className="field">
                                        <input type="checkbox" className="switch is-rounded" id="transcode" name="transcode" defaultChecked={userState.transcode} />
                                        <label htmlFor="transcode">Transcode</label>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <span className="buttons">
                            <input id="saveButton" type="button" value="Save" className="button is-primary" onClick={(e) => this.save()} />
                        </span>
                    </form>
                </section>
            </div>
        );
    }
}