---
title: ESP32 Quick Start - PicoServer.Nano
description: PicoServer.Nano ESP32 development guide, running Web services on embedded devices
prev:
  text: Benchmark
  link: /en/benchmark
next:
  text: PicoServer.Nano Benchmark
  link: /en/nano-benchmark
---

<p align="center">
  <img src="/nano-logo.png" alt="PicoServer.Nano" width="200">
</p>

# 🔌 PicoServer.Nano (for .NET nanoFramework)

**PicoServer.Nano** (NuGet package: `PicoServer.Nano`) is a lightweight port of PicoServer to the **.NET nanoFramework** ecosystem. It is a zero-dependency "Web glue library" designed specifically for resource-constrained microcontrollers, with special adaptation and optimization for **ESP32**.

> **What is .NET nanoFramework?**
>
> A project under the Microsoft .NET Foundation that shrinks the full .NET runtime to a few hundred KB, enabling C# code to run on microcontrollers like ESP32 and STM32. You can develop projects in Visual Studio and deploy to boards with one click.

### Difference from Official WebServer Library

PicoServer.Nano **does not use reflection**, has lower memory and CPU footprint, leaving limited resources for business logic.

## Quick Start

### 1. Environment Setup

Install nanoFramework development environment:

1. Install [nanoFramework Visual Studio Extension](https://marketplace.visualstudio.com/items?itemName=nanoframework.nanoFrameworkVS)
2. Flash nanoFramework firmware to ESP32:

```bash
nanoff --target ESP32_S3_ALL --serialport COM5 --update --masserase
```

### 2. Add NuGet Package

```bash
dotnet add package PicoServer.Nano
```

### 3. Write Code

```csharp
using PicoServer.Nano;
using System.Net;

var server = new WebAPIServer();
server.AddRoute("/hello", (req, res) => res.Write("Hello from MCU!"), "GET");
server.StartServer();
Console.WriteLine($"Server started: http://{server.GetIPAddress()}/");
```

Compile and deploy, then visit `http://<device-IP>/hello` in browser to see the response.

## Core Capabilities

| Feature | Supported |
|------|------|
| Route Mapping | ✅ Exact routing |
| Custom Middleware | ✅ |
| Token Authentication | ✅ |
| Static File Hosting | ✅ |
| SSE Long Connection | ✅ |
| File Upload/Download | ✅ |

### Route Registration

```csharp
server.AddRoute("/api/user", UserHandler, "GET");

private static void UserHandler(HttpListenerRequest req, HttpListenerResponse res)
{
    string token = req.GetToken();
    res.Write("{\"id\":1}");
}
```

### Middleware

```csharp
server.AddMiddleware((req, res) =>
{
    if (req.Headers["X-Key"] != "secret")
    {
        res.Write("Unauthorized", 401);
        return false;
    }
    return true;
});
```

### Static File Hosting

Host an entire folder with one line:

```csharp
server.AddStaticFiles("/web", "I:\\www", maxAge: 3600);
```

Visit `http://device-IP/web/index.html` to see the webpage.

### Response Extensions

| Method | Description |
|------|------|
| `res.Write(content, contentType)` | Write response and close |
| `res.SendFile(filePath)` | Send file (streaming) |
| `res.WriteChunk(content)` | Chunked push (SSE/long connection) |

### Request Extensions

| Method | Description |
|------|------|
| `req.GetToken()` | Get Token from Authorization header |
| `req.ReadBodyAsString()` | Read request body as string |
| `req.SaveFile(savePath)` | Save uploaded file |

## Consistent C# Development Experience

**PicoServer** on Windows/Linux/macOS:

```csharp
server.AddRoute("/hello", async (req, res) => await res.WriteAsync("Hello"));
```

**PicoServer.Nano** on ESP32/STM32:

```csharp
server.AddRoute("/hello", (req, res) => res.Write("Hello"));
```

Almost the same API, enabling consistent Web development experience across desktop, cloud, and embedded microcontrollers.

## Notes

1. **Path Format**: Use backslash `\` in nanoFramework, e.g., `"I:\\www"`
2. **Static File Hosting**: Files must be deployed to device (set build action to "Content"), middleware executes in order, recommended to add first
3. **Whitelist**: Routes added to whitelist can skip authentication
4. **Long Connection**: Must call `res.Close()` after `WriteChunk` push completes

## Resources

- NuGet: `PicoServer.Nano` [https://www.nuget.org/packages/PicoServer.Nano](https://www.nuget.org/packages/PicoServer.Nano)
- Website: https://picoserver.cn
- nanoFramework Website: https://www.nanoframework.net