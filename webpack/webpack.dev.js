"use strict";

const { merge } = require("webpack-merge");
const NodemonPlugin = require("nodemon-webpack-plugin");

const common = require("./webpack.common");

module.exports = merge(common, {
  mode: "development",
  plugins: [
    new NodemonPlugin(),
  ],
});
