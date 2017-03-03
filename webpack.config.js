

const path = require('path')

module.exports = {
  context: __dirname + '/examples',
  entry: './main.js',

  output: {
    publicPath: '/assets',
    filename: 'bundle.js',
  },

  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules',
    ],
    alias: {
      'react-flexbox-svg': path.join(__dirname, 'src'),
    },
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },

}
