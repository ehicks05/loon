module.exports = {
    "env": {
        "browser": true,
        "es2020": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 11,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "react/prop-types": "off",
        "no-unused-vars": "warn"
    },
    "settings": {
        "react": {
            "createClass": "createReactClass", // Regex for Component Factory to use,
                                               // default to "createReactClass"
            "pragma": "React",  // Pragma to use, default to "React"
            "version": "detect",
        },
        "parserOptions": {
            "ecmaFeatures": {
                "jsx": true
            }
        },
        "linkComponents": [
            // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
            {"name": "Link", "linkAttribute": "to"}
        ]
    }
};
