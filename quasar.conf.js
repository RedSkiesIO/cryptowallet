/* eslint-disable-next-line */
module.exports = function (ctx) {
  return {
    // app plugins (/src/plugins)
    plugins: ['i18n', 'axios', 'acmwcrypto'],
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
      ],
      directives: ['Ripple'],
      // Quasar plugins
      plugins: ['Notify'],
      // iconSet: ctx.theme.mat ? 'material-icons' : 'ionicons'
      i18n: 'en-us',
    },
    // animations: 'all' --- includes all animations
    animations: [],
    cordova: {
      id: 'com.atlas.mobile.wallet',
    },
  };
};
