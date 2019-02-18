import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default class TextInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render()
    {
        const label = this.props.label;
        const hideLabel = this.props.hideLabel;
        const isStatic = this.props.isStatic ? 'is-static' : '';
        const id = this.props.id;
        const value = this.props.value;
        const required = this.props.required ? 'required' : '';
        const size = this.props.size ? this.props.size : 20;
        let isHorizontal = true;
        if (this.props.horizontal === false)
            isHorizontal = false;
        const autofocus = this.props.autofocus;

        const leftIcon = this.props.leftIcon;

        const onChange = this.props.onChange;

        let fieldClass = 'field';
        fieldClass += isHorizontal ? ' is-horizontal' : '';
        let labelClass = 'field-label';
        labelClass += isHorizontal ? ' is-normal' : '';

        let controlClass = 'control';
        controlClass += leftIcon ? ' has-icons-left' : '';

        const labelEl = !hideLabel ? (isHorizontal ? (
            <div className={labelClass}>
                <label className="label">{label}</label>
            </div>
        ) : (
            <label className="label">{label}</label>
        )) : '';

        const leftIconEl = leftIcon ? (
            <span className="icon is-small is-left">
                <FontAwesomeIcon icon={leftIcon} aria-hidden="true" />
            </span>
        ) : '';

        const controlEl = (
            <div className={controlClass}>
                <input className={"input " + isStatic}
                       type="text"
                       size={size}
                       placeholder={label}
                       id={id}
                       name={id}
                       defaultValue={value}
                       required={required}
                       onChange={onChange}
                       autoFocus={autofocus}
                />
                {leftIconEl}
            </div>);

        const fieldEl = isHorizontal ? (
            <div className="field-body">
                {controlEl}
            </div>
        ) : (controlEl);

        return (
            <div className={fieldClass}>
                {labelEl}
                {fieldEl}
            </div>);
    }
}