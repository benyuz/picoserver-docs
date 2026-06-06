import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "PicoServer 官方文档",
  description: "高性能轻量级 .NET Web 能力胶水库",
  base: '/',

  head: [
    ['link', { rel: 'icon', href: '/logo.png' }],
    ['script', {}, `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?aa5232b78a2bbc44f3f1a61ad62f48a7";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
    `]
  ],

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/',
      themeConfig: {
        outline: { label: '目录' },
        docFooter: { prev: '上一页', next: '下一页' },
        darkModeSwitchLabel: '主题',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '回到顶部',
        nav: [
          { text: '首页', link: '/' },
          { text: '快速入门', link: '/guide' },
          { text: '使用示例', link: '/basic' },
          { text: '集成案例', link: '/examples' },
          { text: '关于我们', link: '/about' }
        ],
        sidebar: [
          {
            text: '📖 入门',
            collapsed: false,
            items: [
              { text: '项目简介', link: '/' },
              { text: '快速入门（含安装）', link: '/guide' }
            ]
          },
          {
            text: '📚 使用示例',
            collapsed: false,
            items: [
              { text: '基础能力', link: '/basic' },
              { text: '高级能力（含鉴权）', link: '/advanced' },
              { text: '自定义中间件', link: '/middleware' }
            ]
          },
          {
            text: '📊 性能测试',
            link: '/benchmark'
          },
          {
            text: '📟 PicoServer.Nano',
            collapsed: false,
            items: [
              { text: 'ESP32 快速上手', link: '/nano-guide' },
              { text: '性能表现', link: '/nano-benchmark' }
            ]
          },
          {
            text: '📘 集成案例',
            link: '/examples'
          },
          {
            text: '📌 更新日志',
            link: '/changelog'
          },
          {
            text: '👥 关于我们',
            link: '/about'
          }
        ]
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Quick Start', link: '/en/guide' },
          { text: 'Usage', link: '/en/basic' },
          { text: 'Examples', link: '/en/examples' },
          { text: 'About', link: '/en/about' }
        ],
        sidebar: [
          {
            text: '📖 Getting Started',
            collapsed: false,
            items: [
              { text: 'Introduction', link: '/en/' },
              { text: 'Quick Start (with Install)', link: '/en/guide' }
            ]
          },
          {
            text: '📚 Usage Examples',
            collapsed: false,
            items: [
              { text: 'Basic Features', link: '/en/basic' },
              { text: 'Advanced Features (Auth)', link: '/en/advanced' },
              { text: 'Custom Middleware', link: '/en/middleware' }
            ]
          },
          {
            text: '📊 Benchmark',
            link: '/en/benchmark'
          },
          {
            text: '📟 PicoServer.Nano',
            collapsed: false,
            items: [
              { text: 'ESP32 Quick Start', link: '/en/nano-guide' },
              { text: 'Benchmark', link: '/en/nano-benchmark' }
            ]
          },
          {
            text: '📘 Integration Examples',
            link: '/en/examples'
          },
          {
            text: '📌 Changelog',
            link: '/en/changelog'
          },
          {
            text: '👥 About',
            link: '/en/about'
          }
        ]
      }
    }
  },

  ignoreDeadLinks: true,

  themeConfig: {
    search: {
      provider: 'local'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/benyuz/picoserver-docs' }
    ],
    footer: {
      copyright: 'Copyright © 2026-present juziyu'
    }
  }
})
