/* eslint-disable */
const path = require('path');

module.exports = (ctx) => {
  return {
    plugins: [
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
    ],
    css: ['app.styl'],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons', // optional, you are not bound to it
      // 'ionicons',
      // 'mdi',
      // 'fontawesome'
    ],
    supportIE: false,
    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
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
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true,
    },
    framework: {
      components: [
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QPageSticky',
        'QScrollArea',
        'QLayoutFooter',
        'QInput',
        'QTabs',
        'QTab',
        'QTabPane',
        'QRouteTab',
        'QPullToRefresh',
        'QTimeline',
        'QTimelineEntry',
        'QInfiniteScroll',
        'QSpinnerDots',
        'QCollapsible',
        'QModal',
      ],
      directives: ['Ripple', 'CloseOverlay'],
      // Quasar plugins
      plugins: ['Notify', 'Dialog', 'ActionSheet'],
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      i18n: 'en-uk',
    },
    // animations: 'all' --- includes all animations
    animations: ['slideInUp', 'slideOutDown'],
    cordova: {
      id: 'com.atlas.mobile.wallet',
    },
  };
};
