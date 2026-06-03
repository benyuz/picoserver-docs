---
layout: home

hero:
  name: "PicoServer"
  text: "高性能轻量级 .NET Web 基础设施"
  tagline: "专为 Native AOT、极低内存消耗与微控制器生态而生的胶水库"
  actions:
    - theme: brand
      text: 快速开始
      link: /quick-start
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/benyuz/picoserver-cn

features:
  - title: ⚡ 极致的 Native AOT 支持
    details: 完全摒弃运行时反射，拥抱 C# Source Generators（源生成器）。所有路由映射在编译期完成，运行时零开销，即时启动。
  - title: 📦 精细化协商缓存
    details: 内置生产级 ETag 强缓存与协商缓存机制，精准控制 HTTP 上下文，大幅压榨并降低高并发下的 CPU 与内存抖动。
  - title: 🔌 延伸至物联网生态
    details: 衍生项目 PicoServer.Nano (v0.8.0) 完美适配 .NET nanoFramework，让 ESP32 等微控制器也能轻松具备强大的网络服务能力。
---
