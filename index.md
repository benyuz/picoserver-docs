---
layout: home

hero:
  name: "PicoServer"
  text: "轻量级 .NET Web 能力胶水库"
  tagline: "跨平台、高性能、零依赖、AOT、极简开发。"
  actions:
    - theme: brand
      text: 🚀 开始探索
      link: /guide
    - theme: alt
      text: 📦 在 NuGet 下载
      link: https://www.nuget.org/packages/PicoServer
    - theme: alt
      text: ⭐ 版本差异对比
      link: /pro

features:
  - title: 📦 极致轻量 (仅几十 kb)
    details: 单 DLL 仅几十 kb，无任何第三方依赖。开箱即用零配置，老旧项目无需修改原有业务代码。
  - title: ⚡ 编译期决议 (Native AOT)
    details: 全异步非阻塞架构，完全摒弃运行时反射，原生支持 Native AOT 编译，毫秒级启动。
  - title: 🌍 完美兼容 (.NET Standard 2.0)
    details: 完美支持 .NET Framework 4.6.1+、Core、.NET 5/6/8+，跨平台支持 Linux、Windows、macOS。

---

## 🏷️ 版本信息

| 版本 | 版本号规则 | 许可证 | 购买链接 |
| :--- | :--- | :--- | :--- |
| **PicoServer（免费版）** | 数字版本号（如 `v1.2.3`） | MIT，免费可商用 | — |
| **PicoServer.Pro（专业版）** | 日期版本号（如 `v2026.4.25`） | 商业授权 | [联系作者获取](https://github.com/benyuz/picoserver-cn) |

> Pro 版本包含免费版所有功能，并在此基础上额外提供国密加密、Source Generator 特性路由、本机访问限定等增强能力。完整对比请参阅 [版本对比](/pro)。

<span class="badge-soft">📜 国家计算机软件著作权 登记号：2026SR0568305</span>
<span class="badge-soft" style="background:#e8f5e9;border-color:#a5d6a7;">✅ PicoServer 免费商用，支持信创</span>

## 📥 下载量

| 包名 | 最新版本 | 总下载量 |
| :--- | :--- | :--- |
| **PicoServer** | ![NuGet version](https://img.shields.io/nuget/v/PicoServer) | ![NuGet downloads](https://img.shields.io/nuget/dt/PicoServer) |
| **PicoServer.Nano** | ![NuGet version](https://img.shields.io/nuget/v/PicoServer.Nano) | ![NuGet downloads](https://img.shields.io/nuget/dt/PicoServer.Nano) |


---

## 🧩 一行代码添加 WebAPI

❤️ 像调用方法一样自然

::: code-group

```csharp [C#]
// 添加根路由映射
MyAPI.AddRoute("/", Hello);
// 启动服务器
MyAPI.StartServer();

// 根路由映射的方法
private async Task Hello(HttpListenerRequest request, HttpListenerResponse response)
{
    await response.WriteAsync("Hello PicoServer");
}
```

```vb [VB.NET]
' 添加根路由映射
MyAPI.AddRoute("/", AddressOf Hello)
' 启动服务器
MyAPI.StartServer()

' 根路由映射的方法
Private Async Function Hello(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Await response.WriteAsync("Hello PicoServer")
End Function
```

:::

> 💡 无需 IIS、无需 Kestrel、无需 Web 开发经验


---

## 🎯 设计哲学

PicoServer 根植于一个朴素的起点：**为了做项目**。不需要的不加、会添乱的不做、让自己慢的不留。

| 原则 | 内涵 | 工程体现 |
|------|------|---------|
| **极简路径** | 从网络请求到业务方法，路径最短 | 监听→路由→方法，三跳直达 |
| **零侵入集成** | 不绑架架构，不强制规范 | 单 DLL（~50 KB），几行代码嵌入 |
| **开箱即用** | 拿来就干，无需理解整个体系 | 无 Builder 模式，一个方法激活一个能力 |
| **默认安全** | 不配错也安全 | 防目录遍历、隐藏文件保护、JWT 自动验过期 |
| **全异步架构** | 从第一行代码即为 async/await | 无阻塞线程，天然匹配 io_uring、异步 V2 |

> **库适应业务，而非业务适应框架。**

---

<div class="content-wrapper">

## .NET 应用 + PicoServer = Web 化应用

PicoServer 是 .NET 生态的轻量级 Web 能力胶水库。零依赖，无需 IIS 或 Kestrel，涵盖 Web API、WebSocket 实时通信、Web 站点构建/静态文件托管等功能场景。零配置，一行代码实现 WebAPI ，不绑架业务。既能轻松扩展现有程序，也能基于它开发独立应用。

| 🧱 你的原有程序 | 🔌 注入 PicoServer | 🌟 升级后的全新形态 |
| :--- | :---: | :--- |
| **工控上位机** | **+ PicoServer** | ＝ 可远程管理的 Web 化上位机 |
| **桌面应用 (WinForms/WPF)** | **+ PicoServer** | ＝ 带 API 接口的桌面服务 |
| **控制台程序** | **+ PicoServer** | ＝ 轻量独立 Web 服务 |
| **边缘设备端** | **+ PicoServer** | ＝ 具备 Web 能力的边缘节点 |
| **你的程序** | **+ PicoServer** | ＝ **？（留给你的无限可能）** |

---

## 🎯 典型场景

<div class="scene-grid">

<div class="scene-card">
<div class="scene-icon">🌐</div>
<h3>极简 Web API</h3>
<p>不想折腾复杂框架，只需几行代码快速实现接口服务。开箱即用，内置 Token / JWT 认证。</p>
</div>

<div class="scene-card">
<div class="scene-icon">🔄</div>
<h3>老旧项目赋能</h3>
<p>给旧 .NET Framework 项目快速增加 Web 能力，无需重构，不改原有业务代码。</p>
</div>

<div class="scene-card">
<div class="scene-icon">🖥️</div>
<h3>桌面应用 Web 化</h3>
<p>WinForm / WPF / MAUI / Avalonia 增加远程管理接口，单 DLL 嵌入，AOT 支持。</p>
</div>

<div class="scene-card">
<div class="scene-icon">🏭</div>
<h3>边缘网关 / 工控上位机</h3>
<p>对体积、CPU、内存占用严苛的工业网关、边缘计算场景，极低资源消耗。</p>
</div>

<div class="scene-card">
<div class="scene-icon">🌍</div>
<h3>跨平台项目</h3>
<p>Windows、macOS、Linux，胶水特性可与任意库配合使用，一套代码处处运行。</p>
</div>

<div class="scene-card">
<div class="scene-icon">📊</div>
<h3>轻量 Web 应用</h3>
<p>Web 管理后台、SPA 应用、中小型网站，无需 ASP.NET Core，不依赖 IIS。</p>
</div>

</div>

</div>

<style>
.content-wrapper {
  max-width: 1152px;
  margin: 0 auto;
  padding: 48px 24px;
}
.content-wrapper h2 {
  font-size: 24px;
  font-weight: 600;
  margin-top: 48px;
  margin-bottom: 16px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 24px;
  letter-spacing: -0.02em;
}
.content-wrapper ul {
  padding-left: 20px;
  margin-bottom: 16px;
}
.content-wrapper li {
  margin-bottom: 8px;
  line-height: 1.6;
}
table {
  display: table;
  width: 100%;
  margin: 24px 0;
  border-collapse: collapse;
}
th, td {
  border: 1px solid var(--vp-c-divider);
  padding: 12px;
  text-align: left;
}
th {
  background-color: var(--vp-c-bg-alt);
}

.badge-soft {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  font-size: 14px;
  margin: 8px 0;
}

.scene-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin: 24px 0;
}
.scene-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
}
.scene-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
.scene-icon {
  font-size: 28px;
  margin-bottom: 12px;
}
.scene-card h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
}
.scene-card p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}
</style>
