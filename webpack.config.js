const { resolve } = require('path');
const Fiber = require('fibers');

module.exports = {
  entry: './assets/js/index.js',
  output: {
    filename: 'bundle.js',
    path: resolve(__dirname, './dist/assets'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                fiber: Fiber,
              },
            },
          },
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /(node_modules|dist)/,
        loader: 'eslint-loader',
        options: {
          fix: true,
        },
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|dist)/,
        loader: 'babel-loader',
        options: {
          presets: [['@babel/preset-env']],
        },
      },
    ],
  },
};
