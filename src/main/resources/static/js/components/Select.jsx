import React from 'react';

export default class Select extends React.Component {
    constructor(props) {
        super(props);
    }

    render()
    {
        const label = this.props.label;
        const isStatic = this.props.isStatic ? 'is-static' : '';
        const isHorizontal = this.props.horizontal;
        const id = this.props.id;
        const value = this.props.value;
        const blankLabel = this.props.blankLabel;
        const required = this.props.required;
        const items = this.props.items;

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
                <div className="select">
                    <select id={id} name={id} defaultValue={value}>
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
}