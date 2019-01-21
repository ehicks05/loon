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

        let themeUrl = 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.2/css/bulma.min.css';
        if (theme !== 'default')
            themeUrl = 'https://unpkg.com/bulmaswatch/' + theme + '/bulmaswatch.min.css';

        return (
            <Helmet>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Loon</title>

                <link rel="stylesheet" href={themeUrl} />

                <link rel="shortcut icon" href={basename + "/images/puffin.png"} />
                <link rel="stylesheet" type="text/css" href={basename + "/styles/style.css"} media="screen" />
                <script src={basename + "/js/util.js"} />
                <script src={basename + "/js/ajaxUtil.js"} />

                <style>
                    {this.props.theme === 'superhero' ?
                        `#level {background-color: #0c0f29;}`
                        :
                        `#level {background-color: #eee;}`
                    }
                </style>
            </Helmet>);
    }
}