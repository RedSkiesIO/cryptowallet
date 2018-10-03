process.env.NODE_ENV = 'testing';

// const webpack = require('webpack');
// const spawn = require('cross-spawn');
// const QuasarDevServer = require('quasar-cli/lib/dev-server');
// const QuasarConfigGHenerator = require('quasar-cli/lib/generator');
// const quasarConfig = require('../../quasar.conf');
// const webpackConfig = require('../../build/webpack.prod.conf');
// const devConfigPromise = require('../../build/webpack.dev.conf');

// let server;

// devConfigPromise.then((devConfig) => {
//   const devServerOptions = devConfig.devServer;
//   // const compiler = webpack(webpackConfig);
//   server = new DevServer(quasarConfig);
//   return server.listen(devServerOptions.port, devServerOptions.host);
// }).then(() => {
//   let opts = process.argv.slice(2);
//   if (opts.indexOf('--config') === -1) {
//     opts = opts.concat(['--config', 'test/e2e/nightwatch.conf.js']);
//   }
//   if (opts.indexOf('--env') === -1) {
//     opts = opts.concat(['--env', 'chrome']);
//   }

//   const runner = spawn('./node_modules/.bin/nightwatch', opts, { stdio: 'inherit' });

//   runner.on('exit', (code) => {
//     server.close();
//     process.exit(code);
//   });

//   runner.on('error', (err) => {
//     server.close();
//     throw err;
//   });
// });

// const server = new QuasarDevServer(quasarConfig);
