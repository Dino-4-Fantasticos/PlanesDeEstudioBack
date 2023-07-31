const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = function override(config, env) {
  // do stuff with the webpack config...
  config.plugins.push(new NodePolyfillPlugin())
  config.resolve.fallback = {
    "fs": false,
    "child_process": false,
    "net": false,
    "tls": false,
  }
  return config
}
