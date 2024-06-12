const path = require('path');

const resolve = dir => {
  return path.join(__dirname, dir);
};

const env = process.env.NODE_ENV;

const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 启动页地址
  publicPath: process.env.NODE_ENV === 'production' ? './' : './',
  devServer: {
    port: 8088,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: process.env.VUE_APP_URL,
        secure: false,
        changeOrigin: true,
        pathRewrite: (path) => path.replace(/^\/api/, ''),
        // rewrite:{
        //   '^/api': ''
        // }
      }
    },
    client: {
      overlay: false
    }
  }
})
