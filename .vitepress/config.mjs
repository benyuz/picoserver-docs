import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "PicoServer 官方文档",
  description: "高性能轻量级 .NET Web 能力胶水库",
  base: '/',
  
  // ✅ 添加百度统计到 head
  head: [
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
  
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '使用文档', link: '/cs-guide' },
      { text: '更新日志', link: '/changelog' }
    ],
    sidebar: [
      {
        text: '📖 核心指引',
        items: [
          { text: '项目简介与定位', link: '/' }
        ]
      },
      {
        text: '💻 C# 开发指南',
        collapsed: false,
        items: [
          { text: '快速入门与基础路由', link: '/cs-guide' },
          { text: '进阶特性与高级用法', link: '/cs-advanced' }
        ]
      },
      {
        text: '🦁 VB.NET 开发指南',
        collapsed: true,
        items: [
          { text: '快速入门与基础路由', link: '/vb-guide' },
          { text: '进阶特性与高级用法', link: '/vb-advanced' }
        ]
      },
      {
        text: '🚀 性能测试报告',
        items: [
          { text: '开发者基准测试', link: '/benchmark' }
        ]
      },
      {
        text: '📟 PicoServer.Nano',
        collapsed: true,
        items: [
          { text: 'ESP32 快速上手示例', link: '/picoserver-nano-guide' },
          { text: '开发者基准测试', link: '/picoserver-nano-benchmark' }
        ]
      },
      {
        text: '📋 版本演进',
        items: [
          { text: '更新日志 (Changelog)', link: '/changelog' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/benyuz/picoserver-cn' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present juziyu'
    }
  }
})
