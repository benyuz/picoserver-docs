---
layout: home

hero:
  name: "PicoServer"
  text: "为你的 .NET 程序添加 Web 能力"
  tagline: "轻量、跨平台、零依赖、高性能、胶水特性、AOT、极简开发"
  image:
    src: /logo.png
    alt: PicoServer
  actions:
    - theme: brand
      text: 开始探索
      link: /guide
    - theme: alt
      text: NuGet Package
      link: https://www.nuget.org/packages/PicoServer

features:
  - title: 📦 极致轻量 (仅几十 kb)
    details: 单 DLL 仅几十 kb，无任何第三方依赖。开箱即用零配置，老旧项目无需修改原有业务代码。
  - title: ⚡ 原生 AOT 编译 (Native AOT)
    details: 全异步非阻塞架构，完全摒弃运行时反射，原生支持 Native AOT 编译，毫秒级启动。
  - title: 🌍 完美兼容 (.NET Standard 2.0)
    details: 完美支持 .NET Framework 4.6.1+、Core、.NET 5/6/8/10+，跨平台支持 Linux、Windows、macOS。
---

<div class="version-bar">
  <span class="badge-soft">📜 软著 2026SR0568305</span>
  <span class="badge-soft" style="border-color:#a5d6a7;">✅ 免费商用，支持信创</span>
  <img src="https://img.shields.io/nuget/v/PicoServer" alt="最新版本">
  <a href="https://www.nuget.org/packages/PicoServer" target="_blank">
    <img src="https://img.shields.io/nuget/dt/PicoServer" alt="下载量">
  </a>
</div>

## 🧩 一行代码添加 WebAPI

❤️ 像调用方法一样自然，无需学习、无需配置、零依赖。仅需一行代码即可添加 Web API。

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


## 🔄 .NET 应用 + PicoServer = Web 化应用

<div class="card-grid">
  <div class="card">
    <div class="card-icon">🏭</div>
    <h3>工控上位机</h3>
    <p>可远程管理的 Web 化上位机</p>
  </div>
  <div class="card">
    <div class="card-icon">🖥️</div>
    <h3>桌面应用 (WinForms/WPF)</h3>
    <p>带 API 接口的桌面服务</p>
  </div>
  <div class="card">
    <div class="card-icon">📱</div>
    <h3>跨平台项目 (MAUI/Avalonia)</h3>
    <p>带 API 接口的跨平台应用</p>
  </div>
  <div class="card">
    <div class="card-icon">📟</div>
    <h3>控制台程序</h3>
    <p>轻量跨平台独立 Web 服务</p>
  </div>
  <div class="card">
    <div class="card-icon">🌐</div>
    <h3>边缘设备端</h3>
    <p>具备 Web 能力的边缘节点</p>
  </div>
  <div class="card">
    <div class="card-icon">✨</div>
    <h3>你的程序</h3>
    <p>留给你的无限可能</p>
  </div>
</div>

> 💡 PicoServer 无需 IIS、无需 Kestrel、无需 Web 开发经验，一分钟上手

## 🎯 典型场景

<div class="card-grid">

<div class="card">
<div class="card-icon">🌐</div>
<h3>极简 Web API</h3>
<p>不想折腾复杂框架，只需几行代码快速实现接口服务。开箱即用，内置 Token / JWT 认证。</p>
</div>

<div class="card">
<div class="card-icon">🔄</div>
<h3>老旧项目赋能</h3>
<p>给旧 .NET Framework 项目快速增加 Web 能力，无需重构，不改原有业务代码。</p>
</div>

<div class="card">
<div class="card-icon">🖥️</div>
<h3>桌面应用 Web 化</h3>
<p>WinForm / WPF / MAUI / Avalonia 增加远程管理接口，单 DLL 嵌入，AOT 支持。</p>
</div>

<div class="card">
<div class="card-icon">🏭</div>
<h3>边缘网关 / 工控上位机</h3>
<p>对体积、CPU、内存占用严苛的工业网关、边缘计算场景，极低资源消耗。</p>
</div>

<div class="card">
<div class="card-icon">🌍</div>
<h3>跨平台项目</h3>
<p>Windows、macOS、Linux，胶水特性可与任意库配合使用，一套代码处处运行。</p>
</div>

<div class="card">
<div class="card-icon">📊</div>
<h3>轻量 Web 应用</h3>
<p>Web 管理后台、SPA 应用、中小型网站，无需 ASP.NET Core，不依赖 IIS。</p>
</div>

</div>

<style>
.version-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin: 24px 0;
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

/* 统一使用 card-grid 和 card */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin: 24px 0;
}

.card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  background: var(--vp-c-bg-soft);
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px var(--vp-c-shadow);
  border-color: var(--vp-c-brand);
}

.card-icon {
  font-size: 28px;
  margin-bottom: 12px;
}

.card h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.card p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin: 0;
}
</style>