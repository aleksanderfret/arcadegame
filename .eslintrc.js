module.exports = {
  "extends": "airbnb-base",
  "rules": {
    "linebreak-style": ["error", "windows"],
    "object-curly-newline": ["error", {
      "ObjectExpression": {
        "multiline": true,
        "minProperties": 3,
      },
      "ObjectPattern": "never",
    }],
    "no-plusplus": "off",
    "no-mixed-operators": ["error", {
        "allowSamePrecedence": true,
      }
    ],
    "max-len": ["error", {
      "ignoreComments": true,
    },
  ],
  },
  "globals": {
    "ctx": false,
    "Resources": false,
    "game": false,
    "document": false,
  },
};