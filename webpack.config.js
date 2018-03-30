let path = require('path')

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'partch.js',
    library: 'Partch',
    libraryExport: 'default',
    libraryTarget: 'umd'
  },
  mode: 'development'
}
