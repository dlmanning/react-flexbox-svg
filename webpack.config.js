const path = require('path')

module.exports = {
  mode: 'development',

  context: path.join(__dirname, '/examples'),
  entry: './main.js',

  output: {
    publicPath: '/assets',
    filename: 'bundle.js',
  },

  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      'react-flexbox-svg': path.join(__dirname, 'src'),
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
}
