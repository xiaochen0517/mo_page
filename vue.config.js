// const {defineConfig} = require('@vue/cli-service')
// const path = require("path");//文件头部引入path

module.exports = {
    // defineConfig({
    //                  transpileDependencies: true
    //              }),
    // 基本路径
    publicPath: '/mo_page/',
    devServer: {
        port: 8080,
        host: "localhost",
        https: false,
        // 自动启动浏览器
        open: false,
        proxy: {
            "/sugrec": {
                target: "https://www.baidu.com/sugrec", //设置调用的接口域名和端口
                changeOrigin: true, //是否跨域
                ws: true,
                pathRewrite: {
                    "^/sugrec": ""
                }
            }
        }
    },

    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'less',
        patterns: './src/assets/common.less'
      }
    }
}
