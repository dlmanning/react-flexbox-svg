const path = require('path');

module.exports = {
  context: __dirname + '/test',
  entry: './main.js',

  output: {
    publicPath: '/assets',
    filename: 'bundle.js'
  },

  resolve: {
    modulesDirectories: ['src', 'node_modules'],
    extensions: ["", ".js", ".jsx"],
    fallback: path.join(__dirname, "node_modules")
  },

  resolveLoader: { fallback: path.join(__dirname, "node_modules") },

  module: {
    loaders: [
      {
        test: /\.js(x)?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          optional: ["es7.decorators", "es7.classProperties", "optimisation.react.constantElements"]
        }
      }
    ]
  }

};