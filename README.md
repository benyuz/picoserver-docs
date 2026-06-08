<p align="center">
  <img src="https://img.shields.io/nuget/v/PicoServer" alt="NuGet version">
  <img src="https://img.shields.io/nuget/dt/PicoServer" alt="NuGet downloads">

</p>

<h1 align="center">PicoServer</h1>
<p align="center">Lightweight .NET Web Capability Glue Library</p>

<p align="center">
  Cross-Platform · High Performance · Zero Dependencies · AOT · Minimalist Development
</p>

<p align="center">
  <a href="README.zh-CN.md">中文</a>
</p>

---

PicoServer is a lightweight Web capability glue library built on .NET Standard 2.0. A single DLL of only tens of KB with no third-party dependencies — add Web capabilities to any .NET application with just a few lines of code.

**Core Concept**: `.NET Application + PicoServer = Web-Enabled Application`

## Features

- 📦 **Extremely Lightweight** — Single DLL of only tens of KB, zero dependencies, works out of the box
- ⚡ **Native AOT Compilation** — Fully async non-blocking, native AOT support, millisecond startup
- 🌍 **Full Compatibility** — .NET Framework 4.6.1+ through .NET 10+, cross-platform Linux, Windows, macOS
- 🔌 **One-Line WebAPI** — `AddRoute` + `StartServer`, as natural as calling a method
- 🔄 **WebSocket** — Full-duplex communication, heartbeat detection, broadcast push, tested at tens of thousands of connections
- 🔐 **Token / JWT Authentication** — Built-in simple token and JWT auth, with GM/SM3 support (Pro)
- 📁 **Static File Hosting** — Caching strategies, MIME detection, CORS configuration, SPA support, native anti-directory traversal protection
- 🧩 **Custom Middleware** — `AddMiddleware` fully open, sequential execution, on-demand registration

## Quick Start

```bash
dotnet add package PicoServer
```

```csharp
var app = new WebAPIServer();
app.MapGet("/", (req, rsp) => rsp.WriteAsync("Hello PicoServer"));
app.StartServer();
```

## Full Documentation

For complete usage guides, API examples, and performance benchmark reports, visit: [PicoServer Official Docs](https://picoserver.cn)

## Editions

| Edition | Description |
|---------|-------------|
| **Free** | Free for commercial use, complete core functionality without limits |
| **Pro** | Commercial license, includes GM crypto, attribute routing, and enhanced features |

## Use Cases

- [（原创）[C#]【开源】一分钟使用 PicoServer 打造日志服务器](https://www.cnblogs.com/lesliexin/p/19475073)
- [《MAUI 嵌入式 Web 架构实战》— PicoServer 轻量级跨平台 Web 服务方案](https://www.cnblogs.com/densen2014/p/19674503)
- An industrial IoT user deployed PicoServer on a Buildroot embedded Linux with 64MB RAM, using AOT compilation for device Web management, data acquisition, and IIoT networking — effectively reducing costs.
- An apparel industry user leveraged PicoServer's minimalist WebAPI to build internal applications for web-based order production tracking.
- PicoServer User Center: supports user management, order management, online payment and collection — fully automated product sales.

## Contact

- Website: [https://picoserver.cn](https://picoserver.cn)
- QQ: 1305675066
- Email: [PicoServer@qq.com](mailto:PicoServer@qq.com)
- PicoServer NuGet: [https://www.nuget.org/packages/PicoServer](https://www.nuget.org/packages/PicoServer)
- PicoServer.Nano NuGet: [https://www.nuget.org/packages/PicoServer.Nano](https://www.nuget.org/packages/PicoServer.Nano)
