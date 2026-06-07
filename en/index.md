---
layout: home

hero:
  name: "PicoServer"
  text: "Add Web Capabilities to Your .NET Applications"
  tagline: "Lightweight, Cross-platform, Zero-dependency, High-performance, Glue Features, AOT, Minimal Development"
  image:
    src: /logo.png
    alt: PicoServer
  actions:
    - theme: brand
      text: Get Started
      link: /en/guide
    - theme: alt
      text: NuGet Package
      link: https://www.nuget.org/packages/PicoServer

features:
  - title: 📦 Extremely Lightweight (only tens of KB)
    details: A single DLL of only tens of KB, no third-party dependencies. Works out-of-the-box with zero configuration. Legacy projects can integrate without modifying existing business code.
  - title: ⚡ Native AOT Compilation
    details: Fully async non-blocking architecture, completely free of runtime reflection, native Native AOT support, millisecond startup.
  - title: 🌍 Perfect Compatibility (.NET Standard 2.0)
    details: Full support for .NET Framework 4.6.1+, Core, .NET 5/6/8/10+, cross-platform support for Linux, Windows, macOS, iOS (via MAUI).
---

<div class="version-bar">
  <span class="badge-soft">📜 Software Copyright 2026SR0568305</span>
  <span class="badge-soft">✅ Free for Commercial Use, Supports Xinchuang</span>
  <img src="https://img.shields.io/nuget/v/PicoServer" alt="Latest Version">
  <a href="https://www.nuget.org/packages/PicoServer" target="_blank">
    <img src="https://img.shields.io/nuget/dt/PicoServer" alt="Downloads">
  </a>
</div>

## 🧩 Add WebAPI with One Line of Code

❤️ As natural as calling a method — no learning curve, no configuration, zero dependencies. One line of code to add Web API.

::: code-group

```csharp [C#]
// Add root route mapping
MyAPI.AddRoute("/", Hello);
// Start the server
MyAPI.StartServer();

// Method mapped to the root route
private async Task Hello(HttpListenerRequest request, HttpListenerResponse response)
{
    await response.WriteAsync("Hello PicoServer");
}
```

```vb [VB.NET]
' Add root route mapping
MyAPI.AddRoute("/", AddressOf Hello)
' Start the server
MyAPI.StartServer()

' Method mapped to the root route
Private Async Function Hello(request As HttpListenerRequest, response As HttpListenerResponse) As Task
    Await response.WriteAsync("Hello PicoServer")
End Function
```

:::

## � .NET App + PicoServer = Web-Enabled Application

<div class="card-grid">
  <div class="card">
    <div class="card-icon">🏭</div>
    <h3>Industrial HMI</h3>
    <p>Remote-manageable Web HMI</p>
  </div>
  <div class="card">
    <div class="card-icon">🖥️</div>
    <h3>Desktop App (WinForms/WPF)</h3>
    <p>Desktop service with API interfaces</p>
  </div>
  <div class="card">
    <div class="card-icon">📱</div>
    <h3>Cross-Platform (MAUI/Avalonia)</h3>
    <p>Cross-platform apps with API interfaces</p>
  </div>
  <div class="card">
    <div class="card-icon">📟</div>
    <h3>Console Application</h3>
    <p>Lightweight standalone Web service</p>
  </div>
  <div class="card">
    <div class="card-icon">🌐</div>
    <h3>Edge Device</h3>
    <p>Edge node with Web capabilities</p>
  </div>
  <div class="card">
    <div class="card-icon">✨</div>
    <h3>Your Application</h3>
    <p>Endless possibilities for you to explore</p>
  </div>
</div>

> 💡 No IIS, No Kestrel, No Web development experience required — up and running in a minute

## 🎯 Typical Scenarios

<div class="card-grid">

<div class="card">
<div class="card-icon">🌐</div>
<h3>Minimal Web API</h3>
<p>No need for complex frameworks — just a few lines of code to quickly implement API services. Built-in Token / JWT authentication.</p>
</div>

<div class="card">
<div class="card-icon">🔄</div>
<h3>Empowering Legacy Projects</h3>
<p>Quickly add Web capabilities to old .NET Framework projects without refactoring or changing existing business code.</p>
</div>

<div class="card">
<div class="card-icon">🖥️</div>
<h3>Desktop App Web-Enabling</h3>
<p>Add remote management interfaces to WinForm / WPF / MAUI / Avalonia apps. Single DLL embedding with AOT support.</p>
</div>

<div class="card">
<div class="card-icon">🏭</div>
<h3>Edge Gateway / Industrial HMI</h3>
<p>Industrial gateways and edge computing scenarios with strict size, CPU, and memory constraints. Extremely low resource consumption.</p>
</div>

<div class="card">
<div class="card-icon">🌍</div>
<h3>Cross-Platform Projects</h3>
<p>Windows, macOS, Linux — glue feature works with any library, one codebase runs everywhere.</p>
</div>

<div class="card">
<div class="card-icon">📊</div>
<h3>Lightweight Web Applications</h3>
<p>Web admin backends, SPA applications, small-to-medium websites. No ASP.NET Core required, no IIS dependency.</p>
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

/* Unified card-grid and card styles */
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
