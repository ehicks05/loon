import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {inject, observer} from "mobx-react";

@inject('store')
@observer
export default class TextInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render()
    {
        const label = this.props.label;
        const hideLabel = this.props.hideLabel;
        const id = this.props.id;
        const value = this.props.value;
        const required = this.props.required ? 'required' : '';
        const size = this.props.size ? this.props.size : 20;
        const autoComplete = this.props.autoComplete ? this.props.autoComplete : '';
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

        let inputClass = 'input ';
        inputClass += this.props.isStatic ? ' is-static ' : '';
        inputClass += this.props.inputClass;

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
                <input className={inputClass}
                       type="text"
                       size={size}
                       placeholder={label}
                       id={id}
                       name={id}
                       defaultValue={value}
                       required={required}
                       onChange={onChange}
                       autoFocus={autofocus}
                       autoComplete={autoComplete}
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