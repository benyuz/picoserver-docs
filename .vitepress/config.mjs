import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "PicoServer 官方文档",
  description: "高性能轻量级 .NET Web 能力胶水库",
  base: '/', 
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '使用文档', link: '/quick-start' },
      { text: '更新日志', link: '/changelog' }
    ],
    sidebar: [
      {
        text: '📖 核心指引',
        items: [
          { text: '项目简介与定位', link: '/' },
          { text: '快速开始与 AOT 架构', link: '/quick-start' }
        ]
      },
      {
        text: '⚡ 核心特性解析',
        items: [
          { text: '缓存机制 (ETag)', link: '/http-cache' },
          { text: 'PicoServer.Nano (ESP32)', link: '/pico-nano' }
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
