import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function TextInput(props) {

    const label = props.label;
    const hideLabel = props.hideLabel;
    const id = props.id;
    const value = props.value;
    const required = props.required ? 'required' : '';
    const size = props.size ? props.size : 20;
    const autoComplete = props.autoComplete ? props.autoComplete : '';
    let isHorizontal = props.horizontal;
    const autofocus = props.autofocus;

    const leftIcon = props.leftIcon;

    const onChange = props.onChange;

    let fieldClass = 'field';
    fieldClass += isHorizontal ? ' is-horizontal' : '';
    let labelClass = 'field-label';
    labelClass += isHorizontal ? ' is-normal' : '';

    let controlClass = 'control';
    controlClass += leftIcon ? ' has-icons-left' : '';

    let inputClass = 'input ';
    inputClass += props.isStatic ? ' is-static ' : '';
    inputClass += props.inputClass ? props.inputClass : '';

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
            <div className="field">
                {controlEl}
            </div>
        </div>
    ) : (controlEl);

    return (
        <div className={fieldClass}>
            {labelEl}
            {fieldEl}
        </div>);
}