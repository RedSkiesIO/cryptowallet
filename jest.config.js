/* eslint-disable */
module.exports = {
  'globals': {
    '__DEV__': true
  },
  'collectCoverage': false,
  'collectCoverageFrom': [
    '<rootDir>/src/App.vue',
    '<rootDir>/src/components/**/*.vue',
    '<rootDir>/src/layouts/**/*.vue',
    '<rootDir>/src/pages/**/*.vue',
    '<rootDir>/src/plugins/**/*.js',
    '<rootDir>/src/router/**/*.js',
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
      'branches': 50,
      'statements': 50
    },
    './src/store/': {
      'branches': 100,
      'statements': 100,
    },
    './src/pages/': {
      'branches': 50,
      'statements': 50
    },
    './src/router/': {
      'branches': 50,
      'statements': 50
    },
  },
  'testMatch': [
    '**/tests/unit/src/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
    '**/tests/unit/src/plugins/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
    '**/tests/unit/src/store/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
  ],
  'testPathIgnorePatterns': [
    '<rootDir>/tests/unit/__helpers__',
    '<rootDir>/tests/unit/__coverage__',
    '<rootDir>/tests/unit/__snapshots__',
  ],
  'moduleFileExtensions': [
    'js',
    'json',
    'vue'
  ],
  'moduleNameMapper': {
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.common.js',
    '^quasar$': '<rootDir>/tests/tmp/quasar.common.js',
    '^~/(.*)$': '<rootDir>/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    "^@/components/([^\\.]*)$": "<rootDir>/src/components/$1.vue",
    "^src/components/([^\\.]*)$": "<rootDir>/src/components/$1.vue",
    "^@/components/([^\\.]*)$": "<rootDir>/src/components/$1.vue",
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
