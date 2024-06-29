const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    background: './public/background.js',
    content: './public/content.js',
  },
  output: {
    // Output directory remains the same
    path: path.resolve(__dirname, 'public/polyfill'),
    // Use the name of each entry point defined above to name the output files
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
