export default {
    Search: {
        hint: 'https://www.baidu.com/sugrec?ie=utf-8&json=1&prod=pc&cb=window.baiduCallback&wd=',
        engine: {
            baidu: {
                url: 'https://www.baidu.com/s?wd=',
                icon: 'mopage-baidu',
                name: '百度',
            },
            bing: {
                url: 'https://www.bing.com/search?q=',
                icon: 'mopage-Bing',
                name: '必应',
            },
            google: {
                url: 'https://www.google.com/search?q=',
                icon: 'mopage-google',
                name: '谷歌',
            },
            sougou: {
                url: 'https://www.sogou.com/web?query=',
                icon: 'mopage-Sougou',
                name: '搜狗',
            },
        }
    },

    Theme: {
        bingPic: 'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1',
    },

    Settings: {
        showCollect: true, // 是否显示收藏链接
    },

    Collect: [{
        name: '百度',
        url: 'https://www.baidu.com'
    },{
        name: 'GitHub',
        url: 'https://github.com'
    }]

}