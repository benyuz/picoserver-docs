<p align="center">
  <img src="https://img.shields.io/nuget/v/PicoServer" alt="NuGet version">
  <img src="https://img.shields.io/nuget/dt/PicoServer" alt="NuGet downloads">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

<h1 align="center">PicoServer</h1>
<p align="center">轻量级 .NET Web 能力胶水库</p>

<p align="center">
  跨平台 · 高性能 · 零依赖 · AOT · 极简开发
</p>

---

PicoServer 是一款基于 .NET Standard 2.0 构建的轻量级 Web 能力胶水库。单 DLL 仅几十 KB，无任何第三方依赖，几行代码即可为任意 .NET 程序添加 Web 能力。

**核心概念**：`.NET 应用 + PicoServer = Web 化应用`

## 特性

- 📦 **极致轻量** — 单 DLL 仅几十 KB，零依赖，开箱即用
- ⚡ **编译期决议** — 全异步非阻塞，原生支持 Native AOT，毫秒级启动
- 🌍 **完美兼容** — .NET Framework 4.6.1+ 至 .NET 10，跨平台
- 🔌 **一行代码 WebAPI** — `AddRoute` + `StartServer`，像调用方法一样自然
- 🔄 **WebSocket** — 全双工通信，心跳检测，广播推送，万连接实测
- 🔐 **Token / JWT 鉴权** — 内置简单 Token 和 JWT 鉴权，支持国密 SM3
- 📁 **静态文件托管** — 缓存策略、MIME 识别、跨域配置、SPA 支持
- 🧩 **自定义中间件** — `AddMiddleware` 完全开放，按需注册

## 一键开始

```csharp
var app = new WebAPIServer();
app.MapGet("/", (req, rsp) => rsp.WriteAsync("Hello PicoServer"));
app.StartServer();
```

## 文档

完整的使用指南、API 示例、性能测试报告请访问：

https://picoserver.cn

## 安装

```bash
dotnet add package PicoServer
```

## 版本

| 版本 | 许可证 | 说明 |
|------|--------|------|
| **免费版** | MIT，免费可商用 | 基础功能完备，免费可商用 |
| **Pro 版** | 商业授权 | 含国密加密、Source Generator 特性路由等增强能力 |

## 联系

- 官网：https://picoserver.cn
- NuGet：https://www.nuget.org/packages/PicoServer
- QQ 群：557215238
