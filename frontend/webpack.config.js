const path = require("path");
const webpack = require("webpack");

module.exports = {
  devtool: "eval-cheap-source-map",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"), // change this to the folder djangos collectstatic saves to in production
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        use: ['style-loader', 'css-loader'],
        test: /\.css$/
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify("development"),
      },
    }),
  ],
};
