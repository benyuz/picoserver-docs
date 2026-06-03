---
layout: home

hero:
  name: "PicoServer"
  text: "轻量级 .NET Web 能力胶水库"
  tagline: "跨平台、高性能、零依赖、AOT、极简开发。"
  actions:
    - theme: brand
      text: 🚀 开启嵌入之旅
      link: /quick-start
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/benyuz/picoserver-cn

features:
  - title: 📦 极致轻量 (仅 60kb)
    details: 单 DLL 仅几十kb，无任何第三方依赖。开箱即用零配置，老旧项目无需修改原有业务代码。
  - title: ⚡ 编译期决议 (Native AOT)
    details: 全异步非阻塞架构，完全摒弃运行时反射，原生支持 Native AOT 编译，毫秒级启动。
  - title: 🌍 完美兼容 (.NET Standard 2.0)
    details: 完美支持 .NET Framework 4.6.1+、Core、.NET 5/6/8+，跨平台支持 Linux、Windows、macOS。
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

## 🎯 什么时候选择 PicoServer？

* **轻量化赋能**：极其适合用来快速开发各种**轻量级独立工具、轻量 CMS、设备配置后台**等小而美的应用，免去笨重的框架负担。
* **主程序需要“顺便”加个接口**：比如给现有的控制台程序、桌面应用（WinForms/WPF）、Windows 服务增加 Web API 支持。
* **追求“极致透明”**：你希望每一行处理逻辑（中间件/路由）都在你眼皮底下，而非隐藏在黑盒之中。
* **资源敏感型环境**：在工业 PC（工控机）、边缘设备或 MCP (AI 大模型助手调用) 场景，每一兆内存都弥足珍贵。
* **纯粹的流处理**：只需搭建简单的文件上传下载、视频流转发或内网穿透网关。

</div>

<style>
/* 让首页下方的自定义文本排版更美观 */
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
/* 优化表格样式 */
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
</style>
