import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "PicoServer",
  description: "高性能轻量级 .NET Web 基础设施",
  base: '/', 
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '技术文档', link: '/quick-start' }
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
