/* eslint-disable */
const envparser = require('./config/envparser');
const path = require('path');

module.exports = (ctx) => {
  return {
    boot: [
      'i18n',
      'Axios',
      'CWCrypto',
      'VuexRouterSync',
      'Toaster',
      'ErrorHandler',
      'Permissions',
      'AppInvitation',
      'Sms',
      'Email',
      'ContactsImport',
      'CryptoWalletSDK',
      'WalletDiscovery',
      'CoinFormatter',
      'VueTrend',
      'VueSelect',
      'Vuelidate',
      'BackEndService',
      'AccountInitializer'
    ],
    css: ['app.styl'],
    extras: [
      'roboto-font',
      'material-icons',
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
      ],
      directives: ['Ripple', 'CloseDialog', 'ClosePopup'],
      // Quasar plugins
      plugins: ['Notify', 'Dialog', 'BottomSheet'],
      // iconSet: 'material-icons'
      lang: 'en-gb',
    },
    // animations: 'all' --- includes all animations
    animations: ['slideInUp', 'slideOutDown'],
    cordova: {
      id: 'com.atlas.mobile.wallet',
    },
  };
};
