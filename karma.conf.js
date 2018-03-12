module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    files: ['test/*.js'],
    browsers: ['Chrome'],
    preprocessors: {
      'test/*.js': ['webpack']
    },
    webpack: {
      mode: 'development'
    },
    reporters: ['mocha']
  })
}
