/* eslint-disable */

module.exports = {
  'globals': {
    '__DEV__': true
  },
  'collectCoverage': false,
  'collectCoverageFrom': [
    '<rootDir>/src/components/**/*.vue',
    '<rootDir>/src/layouts/**/*.vue',
    '<rootDir>/src/pages/**/*.vue',
    '<rootDir>/src/store/**/*.js'
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
    './src/store/': {
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
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.common.js',
    '^quasar$': '<rootDir>/node_modules/quasar-framework/dist/umd/quasar.mat.umd.min.js',
    '^~/(.*)$': '<rootDir>/$1',
    '^@/(.*)$': '<rootDir>/src/$1'
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
  },
  'snapshotSerializers': [
    '<rootDir>/node_modules/jest-serializer-vue'
  ]
};
