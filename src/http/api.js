export default {
    Search: {
        hint: 'https://www.baidu.com/sugrec?ie=utf-8&json=1&prod=pc&cb=window.baiduCallback&wd=',
        engine: {
            baidu: {
                url: 'https://www.baidu.com/s?wd=',
                icon: '/icon/engine/baidu.svg', // 图标在assets文件夹中的位置
            },
            bing: {
                url: 'https://www.bing.com/search?q=',
                icon: '/icon/engine/bing.svg',
            },
            google: {
                url: 'https://www.google.com/search?q=',
                icon: '/icon/engine/google.svg',
            },
            sougou: {
                url: 'https://www.sogou.com/web?query=',
                icon: '/icon/engine/sougou.svg',
            },
        }
    },

    Theme: {
        bingPic: 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1',
    },

    // 首页
    Index: {
        index: '/index/index'
    },

    // 个人中心
    Home: {
        UserInfo: '/user/info'
    },

}