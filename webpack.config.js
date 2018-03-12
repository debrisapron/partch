let path = require('path')

module.exports = {
  entry: './entry.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'partch.js',
    library: 'Partch',
    libraryTarget: 'umd'
  },
  mode: 'development'
}
