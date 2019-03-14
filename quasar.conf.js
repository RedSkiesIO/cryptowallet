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
      'AppDataEncryption',
      'CryptoWalletSDK',
      'WalletDiscovery',
      'CoinFormatter',
      'VueTrend',
      'VueSelect',
      'Vuelidate',
      'BackEndService',
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
        'QHeader', //renamed, was QHeaderLayout
        //'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtnGroup',
        'QBtn',
        'QIcon',
        'QList',
        //'QListHeader',
        'QItem',
        // 'QItemMain',
        // 'QItemSide',
        'QPageSticky',
        'QScrollArea',
        'QFooter', // renamed, was QFooterLayout
        'QInput',
        'QTabs',
        'QTab',
        //'QTabPane',
        'QTabPanels',
        'QTabPanel',
        'QRouteTab',
        'QPullToRefresh',
        'QTimeline',
        'QTimelineEntry',
        'QInfiniteScroll',
        'QSpinnerDots',
        // 'QCollapsible',
        // 'QModal',
        'QDialog',
        // 'QModalLayout',
        'QToggle',
        'QRadio',
        'QSelect',
        'QSlider',
        'QScrollObserver', // renamed, was QScrollObservable
        'QBanner', // renamed, was QAllert
        // 'QSearch',
        // 'QAutocomplete',
        'QCarousel',
        'QCarouselSlide',
        'QCarouselControl',
        'QCheckbox',
      ],
      directives: ['Ripple'],
      // Quasar plugins
      plugins: ['Notify', 'Dialog', 'BottomSheet', 'AppVisibility'], // ActionSheet is now BottomSheet
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
