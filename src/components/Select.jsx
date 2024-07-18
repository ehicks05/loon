import React from 'react';

export default function Select(props) {

    const label = props.label;
    const isHorizontal = props.horizontal;
    const id = props.id;
    const value = props.value;
    const blankLabel = props.blankLabel;
    const required = props.required;
    const items = props.items;
    const multiple = props.multiple;
    const size = props.size ? props.size : null;

    if (!required)
        items.splice(0, 0, {value: '', text: blankLabel});

    const labelEl = isHorizontal ?
        <div className="field-label is-normal">
            <label className="label">{label}</label>
        </div>
        :
        <label className="label">{label}</label>;

    const options = items.map((item, index) =>
        <option key={index} value={item.value}>{item.text}</option>
    );

    let select =
        <div className="control">
            <div className={"select " + (multiple ? 'is-multiple' : '')}>
                <select id={id} name={id} defaultValue={value} multiple={multiple} size={size} style={{overflow: 'auto'}}>
                    {options}
                </select>
            </div>
        </div>;

    select = isHorizontal ?
        <div className="field-body">
            <div className="field is-narrow">
                {select}
            </div>
        </div>
        :
        select
    ;

    return (
        <div className={"field " + (isHorizontal ? 'is-horizontal' : '')}>
            {labelEl}
            {select}
        </div>);
}