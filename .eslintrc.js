module.exports = {
    "env": {
        "node": true,
        "es6": true
    },
    "parserOptions": {
        "ecmaVersion": 2017
    },
    "extends": ["eslint:recommended", "plugin:prettier/recommended"],
    "rules": {
        "strict": [
            "error",
            "global"
        ],
        "prefer-const": "error"
    }
};
