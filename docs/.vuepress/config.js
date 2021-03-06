module.exports = {
  title: "且偷浮生半日闲",
  description: 'Is it just me, or is it getting crazier out there?',
  dest: '../dist',
  base: '/blog/',
  head: [
    ['link', { rel: 'icon', href: '/icon.ico' }],
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }]
  ],
  theme: 'reco',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/', icon: 'reco-home' },
      { text: 'TimeLine', link: '/timeline/', icon: 'reco-date' },
      { text: 'GitHub', link: 'https://github.com/vergil0210', icon: 'reco-github' },
    ],
    type: 'blog',
    // 博客设置
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: 'Category' // 默认 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: 'Tag' // 默认 “标签”
      }
    },
    friendLink: [
      // {
      //   title: '午后南杂',
      //   desc: 'Enjoy when you can, and endure when you must.',
      //   email: '1156743527@qq.com',
      //   link: 'https://www.recoluan.com'
      // },
    ],
    logo: '/icon.ico',
    // 搜索设置
    search: true,
    searchMaxSuggestions: 10,
    // 自动形成侧边导航
    sidebar: 'auto',
    sidebarDepth: 2,
    // 最后更新时间
    lastUpdated: 'Last Updated',
    // 作者
    author: '且偷浮生半日闲',
    // 作者头像
    authorAvatar: '/portrait.jpg',
    // 备案号
    // record: 'xxxx',
    // 项目开始时间
    startYear: '2020',
    /**
     * 密钥 (if your blog is private)
     */

    // keyPage: {
    //   keys: ['your password'],
    //   color: '#42b983',
    //   lineColor: '#42b983'
    // },

    /**
     * valine 设置 (if you need valine comment )
     */

    valineConfig: {
      appId: 'J5UyfTbrWPsemraxheiczN6R-gzGzoHsz',// your appId
      appKey: 'B8vypz2tid7I8vgBe04wOwMz', // your appKey
    }
  },
  markdown: {
    lineNumbers: true
  }
}  
