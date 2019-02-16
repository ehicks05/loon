import React from 'react';

export default class Select extends React.Component {
    constructor(props) {
        super(props);
    }

    render()
    {
        const label = this.props.label;
        const isStatic = this.props.isStatic ? 'is-static' : '';
        const isHorizontal = 'is-horizontal';
        const id = this.props.id;
        const value = this.props.value;
        const blankLabel = this.props.blankLabel;
        const required = this.props.required;
        const items = this.props.items;

        const labelClass = isHorizontal ? 'field-label is-normal' : 'field-label';

        return (
            <div className={"field " + isHorizontal}>
                <div className={labelClass}>
                    <label className="label">{label}</label>
                </div>
                <div className="field-body">
                    <div className="control">
                        <div className="select">
                            <input type="hidden" id={id + "prev"} value={value}/>
                            <select id={id} name={id} defaultValue={value}>
                                {!required && <option value="">{blankLabel}</option>}

                                {
                                    items.map((item, index) =>
                                        <option key={index} value={item.value}>{item.text}</option>
                                    )
                                }

                            </select>
                        </div>
                    </div>
                </div>
            </div>);
    }
}