/**
 * 配置参考：https://wechat-miniprogram.github.io/kbone/docs/config/
 */
const path = require('path')
module.exports = {
    origin: 'https://test.miniprogram.com',
    entry: '/',
    router: {
        index: [
            '/home',
            '/detail'
        ]
    },
    redirect: {
        notFound: 'home',
        accessDenied: 'home',
    },
    generate: {
        appEntry: 'miniprogram-app',
        autoBuildNpm: 'npm',
        projectConfig: path.join(__dirname, '../dist/mp'),
    },
    app: {
        backgroundTextStyle: 'dark',
        navigationBarTextStyle: 'white',
        navigationBarTitleText: '万花筒',
    },
    appExtraConfig: {
        sitemapLocation: 'sitemap.json',
    },
    global: {
        share: true,
        windowScroll: false,
        backgroundColor: '#F7F7F7',
    },
    pages: {

    },
    optimization: {
        domSubTreeLevel: 10,

        elementMultiplexing: true,
        textMultiplexing: true,
        commentMultiplexing: true,
        domExtendMultiplexing: true,

        styleValueReduce: 5000,
        attrValueReduce: 5000,
    },
    projectConfig: {
        projectname: 'nlp',
        appid: 'wxf3affec18330c80c',
        miniprogramRoot: 'miniprogram/', // 小程序根目录
        cloudfunctionRoot: 'cloudfunctions/', // 云函数根目录
    },
}
