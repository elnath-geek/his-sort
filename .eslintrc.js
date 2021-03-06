module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "@vue/prettier"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-irregular-whitespace": "off",
    "space-before-blocks": "off",
    "prettier/prettier": [
      {
        "bracket-spacing": false
      }
    ]
  },
  parserOptions: {
    parser: "babel-eslint"
  }
};
