module.exports = {
  entry: 'index.js',

  output: {
    publicPath: '/assets',
    filename: 'bundle.js'
  },

  loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          optional: ["es7.decorators", "es7.classProperties"]
        }
      }
    ]
};
