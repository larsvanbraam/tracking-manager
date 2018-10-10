const path = require('path');

module.exports = {
  entry: './example/src/index.js',
  devServer: {
    contentBase: './example',
    compress: true,
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        loader: 'ts-loader',
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, '../../../example/'),
    filename: 'bundle.js',
  },
};
