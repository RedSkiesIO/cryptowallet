/*eslint-disable*/
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
    '<rootDir>/src/store/**/*.js',
    '<rootDir>/src/helpers/**/*.js',
    '<rootDir>/src/actions/**/*.js',
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
    '**/src/components/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
    '**/src/layouts/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
    '**/src/helpers/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
    '**/src/actions/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
    '**/src/plugins/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
    '**/src/router/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
    '**/src/store/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
  ],
  'testPathIgnorePatterns': [
    'mock',
  ],
  'moduleFileExtensions': [
    'js',
    'json',
    'vue'
  ],
  'moduleNameMapper': {
    '^vue$': '<rootDir>/node_modules/vue/dist/vue.common.js',
    '^quasar$': '<rootDir>/tests/unit/quasar.common.js',
    '^@/components/([^\\.]*)$': '<rootDir>/src/components/$1/index.vue',
    '^@/layouts/([^\\.]*)$': '<rootDir>/src/layouts/$1/index.vue',
    '^@/helpers([^\\.]*)$': '<rootDir>/src/helpers/$1/index.js',
    '^@/actions([^\\.]*)$': '<rootDir>/src/actions/$1/index.js',
    '^@/i18n/([^\\.]*)$': '<rootDir>/src/i18n/index.js',
    '^@/plugins/([^\\.]*)$': '<rootDir>/src/plugins/$1/index.js',
    '^@/store/([^\]*)$': '<rootDir>/src/store/$1',
    '@/cordovaMocks': '<rootDir>/tests/CordovaMocks/index.js',
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
