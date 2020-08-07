/* eslint-disable */
const envparser = require('./config/envparser');
const path = require('path');

module.exports = (ctx) => {
  return {
    boot: [
      'i18n',
      'CWCrypto',
      'VuexRouterSync',
      'Toaster',
      'ErrorHandler',
      'CryptoWalletSDK',
      'WalletDiscovery',
      'VueTrend',
      'VueSelect',
      'Vuelidate',
      'BackEndService',
      'AccountInitializer',
      'ENS',
      'Magic'
    ],
    css: ['app.styl'],
    extras: [
      'roboto-font',
      'material-icons',
      'fontawesome-v5'
    ],
    supportIE: false,
    build: {
      scopeHoisting: true,

      extendWebpack(cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
        });
        
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          '@': path.resolve(__dirname, './src/'),
        };
      },
      chainWebpack: config => {
        config.output
          .globalObject('this')
        /* ... */
      },
      uglifyOptions: {
        mangle: false,
      },
      env: envparser(),
    },
    devServer: {
      open: true,
    },
    framework: {
      components: [
        'QLayout',
        'QHeader',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtnGroup',
        'QBtn',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QPageSticky',
        'QScrollArea',
        'QFooter',
        'QInput',
        'QTabs',
        'QTab',
        'QTabPanels',
        'QTabPanel',
        'QRouteTab',
        'QPullToRefresh',
        'QTimeline',
        'QTimelineEntry',
        'QInfiniteScroll',
        'QSpinnerDots',
        'QExpansionItem',
        'QDialog',
        'QToggle',
        'QRadio',
        'QSelect',
        'QSlider',
        'QScrollObserver',
        'QBanner',
        'QCarousel',
        'QCarouselSlide',
        'QCarouselControl',
        'QCheckbox',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QSlideItem',
        'QAvatar',
        'QInnerLoading',
        'QSpinner',
        'QCircularProgress'
      ],
      directives: ['Ripple', 'ClosePopup', 'ClosePopup'],
      // Quasar plugins
      plugins: ['Notify', 'Dialog', 'BottomSheet'],
      // iconSet: 'material-icons'
      lang: 'en-gb',
    },
    // animations: 'all' --- includes all animations
    animations: ['slideInUp', 'slideOutDown'],
    cordova: {
      id: 'com.cent.mobile.wallet',
      iosStatusBarPadding: false,
    },
  };
};
 