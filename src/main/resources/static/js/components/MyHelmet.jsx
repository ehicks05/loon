import React from 'react';
import Helmet from 'react-helmet';

export default class MyHelmet extends React.Component {
    constructor(props) {
        super(props);
    }

    render()
    {
        const basename = '';

        let theme = this.props.theme;
        if (!theme)
            theme = 'default';

        let themeUrl = 'https://unpkg.com/bulmaswatch/' + theme + '/bulmaswatch.min.css';

        let selectedTrack = this.props.tracks ? this.props.tracks.find(track => track.id === this.props.selectedTrackId) : null;
        let trackTitle = selectedTrack ? ' - ' + selectedTrack.title : '';

        return (
            <Helmet>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Loon{trackTitle}</title>

                <link rel="stylesheet" href={themeUrl} />

                <link rel="shortcut icon" href={basename + "/images/puffin.png"} />
                <link rel="stylesheet" type="text/css" href={basename + "/styles/style.css"} media="screen" />

                <style>
                    {this.props.theme === 'superhero' || this.props.theme === 'darkly' || this.props.theme === 'slate' ?
                        `#level {background-color: #0c0f29;}`
                        :
                        `#level {background-color: #eee;}`
                    }
                </style>
            </Helmet>);
    }
}