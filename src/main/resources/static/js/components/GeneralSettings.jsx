import React from 'react';
import {inject, observer} from "mobx-react";
import 'bulma-extensions/bulma-switch/dist/css/bulma-switch.min.css'

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
                                <td style={cellStyle} className={''}><label htmlFor="transcode">Transcode</label></td>
                                <td style={cellStyle} className={'has-text-centered'}>
                                    <input type="checkbox" id="transcode" name="transcode" defaultChecked={userState.transcode} /></td>
                            </tr>
                            </tbody>
                        </table>

                        {/*<div className="field">*/}
                        {/*    <input id="switchExample" type="checkbox" name="switchExample" className="switch"*/}
                        {/*           checked="checked" />*/}
                        {/*        <label htmlFor="switchExample">Switch example</label>*/}
                        {/*</div>*/}


                        <span className="buttons">
                            <input id="saveButton" type="button" value="Save" className="button is-primary" onClick={(e) => this.save()} />
                        </span>
                    </form>
                </section>
            </div>
        );
    }
}