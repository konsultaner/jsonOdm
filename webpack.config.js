const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname, './src/index.js'),
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules|test/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js'],
  },
  output: {
    library: 'jsonOdm',
    path: path.resolve(__dirname, './dist'),
    filename: 'jsonOdm.js',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  devServer: {
    static: path.resolve(__dirname, './dist'),
  },
};
