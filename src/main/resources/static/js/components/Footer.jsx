import React from 'react';

export default class Footer extends React.Component {
    render()
    {
        return (
            <span title={"Rendered in " + this.props.serverProcessingTime + " ms"}>

            </span>);
    }
}