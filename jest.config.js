/* eslint-disable */

module.exports =
  {
    'globals': {
      '__DEV__': true
    },
    'collectCoverage': true,
    'collectCoverageFrom': [
      '<rootDir>/src/**/*.{js}',
      '<rootDir>/src/**/*.{vue}'
    ],
    'coverageDirectory': '<rootDir>/test/coverage',
    'coverageThreshold': {
      'global': {
        'branches': 50,
        'functions': 50,
        'lines': 50,
        'statements': 50
      },
      './src/components/': {
        'branches': 40,
        'statements': 40
      },
      './src/reducers/**/*.js': {
        'statements': 90,
      }
    },
    'testMatch': [
      '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
    ],
    'testPathIgnorePatterns': [
      '<rootDir>/components/coverage/'
    ],
    'moduleFileExtensions': [
      'js',
      'json',
      'vue'
    ],
    'moduleNameMapper': {
      '^@/(.*)$': '<rootDir>/src/$1',
      '^vue$': 'vue/dist/vue.common.js',
      'quasar': 'quasar-framework/dist/umd/quasar.mat.umd.min.js'
    },
    'transformIgnorePatterns': [
      'node_modules/core-js',
      'node_modules/babel-runtime',
      'node_modules/lodash',
      'node_modules/vue'
    ],
    'transform': {
      '^.+\\.vue$': 'vue-jest',
      '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
      '^.+\\.js$': 'babel-jest',
    },
    snapshotSerializers: ['jest-serializer-vue'],
  }