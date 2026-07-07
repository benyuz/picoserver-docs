<p align="center">
  <img src="https://img.shields.io/nuget/v/PicoServer" alt="NuGet 版本">
  <img src="https://img.shields.io/nuget/dt/PicoServer" alt="NuGet 下载量">

</p>

<h1 align="center">PicoServer</h1>
<p align="center">轻量级 .NET Web 能力胶水库</p>

<p align="center">
  跨平台 · 高性能 · 零依赖 · AOT · 极简开发
</p>

<p align="center">
  <a href="README.md">English</a> | 中文
</p>

---

PicoServer 是一款基于 .NET Standard 2.0 构建的轻量级 Web 能力胶水库。单 DLL 仅几十 KB，无任何第三方依赖，几行代码即可为任意 .NET 程序添加 Web 能力。

**核心概念**：`.NET 应用 + PicoServer = Web 化应用`

## 特性

- 📦 **极致轻量** — 单 DLL 仅几十 KB，零依赖，开箱即用
- ⚡ **原生 AOT 编译** — 全异步非阻塞，原生支持 Native AOT，毫秒级启动
- 🌍 **完美兼容** — .NET Framework 4.6.1+ 至 .NET 10+，跨平台支持 Linux、Windows、macOS
- 🔌 **一行代码 WebAPI** — `AddRoute` + `StartServer`，像调用方法一样自然
- 🔄 **WebSocket** — 全双工通信，心跳检测，广播推送，万连接实测
- 🔐 **Token / JWT 鉴权** — 内置简单 Token 和 JWT 鉴权
- 📁 **静态文件托管** — 缓存策略、MIME 识别、跨域配置、SPA 支持，原生防目录遍历保护
- 🧩 **自定义中间件** — `AddMiddleware` 完全开放，顺序执行，按需注册

## 快速开始

```bash
dotnet add package PicoServer
```

```csharp
var app = new WebAPIServer();
app.MapGet("/", (req, rsp) => rsp.WriteAsync("Hello PicoServer"));
app.StartServer();
```

## 详细文档

完整的使用指南、API 示例、性能测试报告请访问：[PicoServer 官方文档](https://picoserver.cn)

## 授权

**免费可商用** — 核心功能完备无限制。

## 案例

- [（原创）[C#]【开源】一分钟使用 PicoServer 打造日志服务器](https://www.cnblogs.com/lesliexin/p/19475073)
- [《MAUI 嵌入式 Web 架构实战》— PicoServer 轻量级跨平台 Web 服务方案](https://www.cnblogs.com/densen2014/p/19674503)
- 某工业 IOT 用户在 64MB 内存的 Buildroot 嵌入式 Linux 中部署，借助 PicoServer AOT 实现设备 Web 管理、数据采集、机联网，有效降本。
- 某服装行业用户利用 PicoServer 极简的 WebAPI 开发能力开发内部应用实现用网页查询跟踪订单生产情况
- [书面授权系统](https://s.juziyu.cn/)，支持用户管理，订单管理，在线支付和收款，实现全自动产品售卖
- 某西班牙公司用 PicoServer + H5 完全重构 Winform 项目，实现跨平台部署，降低了开发和维护成本
- 某企业微服务从 NancyFx 平滑迁移至 PicoServer，日均百万请求下，CPU 占用率仅 5%，内存平稳无泄漏，用户评价“非常稳定”。

## 联系

- 官网：[https://picoserver.cn](https://picoserver.cn)
- Q Q: 1305675066
- 邮箱：[PicoServer@qq.com](mailto:PicoServer@qq.com)
- PicoServer NuGet：[https://www.nuget.org/packages/PicoServer](https://www.nuget.org/packages/PicoServer)
- PicoServer.Nano NuGet：[https://www.nuget.org/packages/PicoServer.Nano](https://www.nuget.org/packages/PicoServer.Nano)
