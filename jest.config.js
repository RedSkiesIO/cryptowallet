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
    'coverageDirectory': '<rootDir>/tests/unit/__coverage__',
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
      '<rootDir>/tests/unit/__coverage__'
    ],
    'moduleFileExtensions': [
      'js',
      'json',
      'vue'
    ],
    'moduleNameMapper': {
      '^@/(.*)$': '<rootDir>/src/$1',
      "^assets/(.*)$": "<rootDir>/src/assets/$1",
      "^variables/(.*)$": "<rootDir>/src/themes/quasar.variables.sty/$1",
      'quasar': 'quasar-framework/dist/umd/quasar.mat.umd.min.js'
    },
    'transformIgnorePatterns': [
      'node_modules/core-js',
      'node_modules/babel-runtime',
      'node_modules/lodash',
      'node_modules/vue'
    ],
    'transform': {
      '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
      '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest',
      '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub'
    },
    'snapshotSerializers': [
      '<rootDir>/node_modules/jest-serializer-vue'
    ]
  }

