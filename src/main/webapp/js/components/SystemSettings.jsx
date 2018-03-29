import React from 'react';
import $ from 'jquery/dist/jquery.min';
import TextInput from "./TextInput.jsx";
import Select from "./Select.jsx";

export default class SystemSettings extends React.Component {
    constructor(props) {
        super(props);
        let self = this;

        this.submitForm = this.submitForm.bind(this);
        this.handleThemeChange = this.handleThemeChange.bind(this);

        let xhr = new XMLHttpRequest();
        xhr.open('GET', window.location.pathname + '?action=form', false);
        xhr.onload = function() {
            if (xhr.status === 200) {
                self.state = {settings: JSON.parse(this.responseText)};
            }
            else {
                alert('Request failed.  Returned status of ' + xhr.status);
            }
        };
        xhr.send();
    }

    handleThemeChange(newTheme)
    {
        this.props.onThemeChange(newTheme);
    }

    submitForm(rescan)
    {
        const self = this;
        const url = '/loon/view/admin/systemSettings?action=modify' + (rescan ? '&rescan=true' : '');
        const formData = $('#frmProject').serialize();
        
        $.ajax({method:"POST", url: url, data: formData, success: function (data) {
                self.handleThemeChange(data.theme);
            }
        });
    }

    render()
    {
        const systemSettings = this.state.settings;

        const themes = [
            {value:'default', text:'default'},
            {value:'cosmo', text:'cosmo'},
            {value:'flatly', text:'flatly'},
            {value:'journal', text:'journal'},
            {value:'lux', text:'lux'},
            {value:'pulse', text:'pulse'},
            {value:'simplex', text:'simplex'},
            {value:'superhero', text:'superhero'},
            {value:'united', text:'united'},
            {value:'yeti', text:'yeti'},
        ];

        return (
            <div>
                <section className={"section"}>
                    <div className="container">
                        <h1 className="title">Admin</h1>
                        <h2 className="subtitle">
                            Modify System
                        </h2>
                    </div>
                </section>

                <section className="section">
                    <div className="container">
                        <div className="columns is-multiline is-centered">
                            <div className="column">
                                <form id="frmProject" method="post" action="">

                                    <TextInput id="instanceName" label="Instance Name" value={systemSettings.instanceName} />
                                    <Select id="theme" label="Theme" items={themes} value={systemSettings.theme} required={true}/>
                                    <TextInput id="musicFolder" label="Music Folder" value={systemSettings.musicFolder} />

                                    <input id="saveSystemButton" type="button" value="Save" className="button is-primary" onClick={(e) => this.submitForm()} />
                                    <input id="saveAndRescanButton" type="button" value="Save and Re-scan" className="button is-success" onClick={(e) => this.submitForm(true)} />
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>);
    }
}