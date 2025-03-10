const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    externals: {
      'vue': 'vue',
      '@floating-ui/dom': '@floating-ui/dom',
      'resize-observer-polyfill': 'resize-observer-polyfill'
    }
  }
})
