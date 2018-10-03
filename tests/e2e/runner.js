process.env.NODE_ENV = 'testing'

const webpack = require('webpack')
const spawn = require('cross-spawn')
const QuasarDevServer = require('quasar-cli/lib/dev-server')
const QuasarConfigGenerator = require('quasar-cli/lib/generator')
const quasarConfig = require('../../quasar.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

const devConfigPromise = new Promise((resolve, reject) => {
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      const configCompiler = new QuasarConfigGenerator(quasarConfig);
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`
            ]
          },
          onErrors: config.dev.notifyOnErrors
            ? utils.createNotifierCallback()
            : undefined
        })
      )

      resolve(devWebpackConfig)
    }
  })
})

devConfigPromise.then(devConfig => {
    const devServerOptions = devConfig.devServer
    const server = new QuasarDevServer(quasarConfig);
    return server.listen(devServerOptions.port, devServerOptions.host)
  })
  .then(() => {
    let opts = process.argv.slice(2)
    if (opts.indexOf('--config') === -1) {
      opts = opts.concat(['--config', 'test/e2e/nightwatch.conf.js'])
    }
    if (opts.indexOf('--env') === -1) {
      opts = opts.concat(['--env', 'chrome'])
    }

    const runner = spawn('./node_modules/.bin/nightwatch', opts, {
      stdio: 'inherit'
    })

    runner.on('exit', code => {
      server.close()
      process.exit(code)
    })

    runner.on('error', err => {
      server.close()
      throw err
    })
  })
