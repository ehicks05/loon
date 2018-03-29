import React from 'react';

export default class TextInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render()
    {
        const label = this.props.label;
        const isStatic = this.props.isStatic ? 'is-static' : '';
        const id = this.props.id;
        const value = this.props.value;
        const required = this.props.required ? 'required' : '';

        return (
            <div className="field is-horizontal">
                <div className="field-label">
                    <label className="label">{label}</label>
                </div>
                <div className="field-body">
                    <div className="control">
                        <input className={"input " + isStatic}
                               type="text"
                               placeholder={label}
                               id={id}
                               name={id}
                               defaultValue={value}
                               required={required}/>
                    </div>
                </div>
            </div>);
    }
}