module.exports = {
  "extends": [
    "react-app",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  "plugins": ["eslint-plugin-import-helpers"],
  "settings": {
    "react": {
      "version": "999.999.999"
    }
  },
  "rules": {
    "import-helpers/order-imports": [
      "error",
      {
        "newlinesBetween": "always",
        "groups": [["module"], ["parent", "sibling", "index"]]
      }
    ],
  }
}