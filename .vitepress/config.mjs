import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "PicoServer 官方文档",
  description: "高性能轻量级 .NET Web 能力胶水库",
  base: '/', 
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '使用文档', link: '/cs-guide' }, // 默认导向 C# 指南
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
        collapsed: false, // 默认展开
        items: [
          { text: '快速入门与基础路由', link: '/cs-guide' },
          { text: '进阶特性与高级用法', link: '/cs-advanced' }
        ]
      },
      {
        text: '🦁 VB.NET 开发指南',
        collapsed: true, // 默认折叠
        items: [
          { text: '快速入门与基础路由', link: '/vb-guide' },
          { text: '进阶特性与高级用法', link: '/vb-advanced' }
        ]
      },
      {
        // ⭐ 性能测试精简合并为一个独立页面，无子级折叠，更直观
        text: '🚀 性能测试报告',
        items: [
          { text: '基准测试与吞吐量报告', link: '/perf-test' }
        ]
      },
      {
        text: '📟 PicoServer.Nano (ESP32)',
        collapsed: true, // 默认折叠
        items: [
          { text: 'ESP32 快速上手示例', link: '/pico-nano-guide' },
          { text: '硬件级性能调优报告', link: '/pico-nano-perf' }
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
