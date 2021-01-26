"use strict";

const path = require("path");
const nodeExternals = require("webpack-node-externals");

const CWD = process.cwd();

module.exports = {
  name: "server",
  entry: [path.join(CWD, "./src/index.ts")],
  output: {
    path: path.join(CWD, "/dist"),
    filename: "server.bundle.js",
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  target: "node",
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  externals: [nodeExternals()],
};
