---
next:
  text: 基础能力
  link: /basic
---

# 💡 快速入门（含安装）

> 默认监听端口为 `8090`。在 Windows 环境下运行如果绑定失败，请注意赋予应用管理员权限。推荐使用 **PicoServer** 最新版本保障功能完整性。

---

## 0. 安装

在 Visual Studio 的 NuGet 包管理器中搜索 `PicoServer` 并安装，或在项目目录执行：

```bash
dotnet add package PicoServer
```

### 版本说明

| 版本 | 说明 | AOT 支持 |
|------|------|---------|
| 免费版 | 基础功能完备，免费可商用，单 DLL 仅几十 kb | ✅ 支持 |
| Pro 版 | 含国密加密、特性路由 Source Generator、高级中间件 | ✅ 完美支持 |

> 免费版完全支持 AOT 编译；特性路由通过扩展包 `PicoServer.Extensions` 基于反射实现，Pro 版特性路由采用 Source Generator 编译期生成，100% 完美适配 Native AOT。

### 支持的 .NET 运行时

| 平台 | 支持版本 |
|------|---------|
| .NET Framework | 4.6.1 及以上 |
| .NET Core | 2.0 及以上 |
| .NET 5/6/7/8+ | ✅ 完全支持 |

| 操作系统 | 说明 |
|---------|------|
| Windows 7/8/10/11 | ✅ 完全支持 |
| Windows Server 2008+ | ✅ 完全支持 |
| Linux (Ubuntu, CentOS, Debian 等) | ✅ 完全支持 |
| macOS | ✅ 完全支持 |
| Docker 容器 | ✅ 完全支持 |

---

## 1. 最简 WebAPI

只需三行核心代码，即可在任意 .NET 原生应用中启动一个轻量级 Web 服务。

::: code-group

```csharp [C#]
using System;
using System.Threading.Tasks;
using System.Net;
using PicoServer;

class Program
{
    private static readonly WebAPIServer MyAPI = new WebAPIServer();

    static void Main()
    {
        MyAPI.AddRoute("/", Hello);
        MyAPI.StartServer();

        Console.WriteLine("服务已启动: http://127.0.0.1:8090");
        Console.ReadKey();

        MyAPI.StopServer();
    }

    private static async Task Hello(HttpListenerRequest request, HttpListenerResponse response)
    {
        await response.WriteAsync("Hello PicoServer");
    }
}
```

```vb [VB.NET]
Imports System
Imports System.Threading.Tasks
Imports System.Net
Imports PicoServer

Module Program
    Private ReadOnly MyAPI As New WebAPIServer()

    Sub Main()
        MyAPI.AddRoute("/", AddressOf Hello)
        MyAPI.StartServer()

        Console.WriteLine("服务已启动: http://127.0.0.1:8090")
        Console.ReadKey()

        MyAPI.StopServer()
    End Sub

    Private Async Function Hello(request As HttpListenerRequest, response As HttpListenerResponse) As Task
        Await response.WriteAsync("Hello PicoServer")
    End Function
End Module
```

:::

---

## 2. 核心控制 API 一览

::: code-group

```csharp [C#]
MyAPI.StartServer();                  // 开启服务（默认端口 8090）
MyAPI.StartServer(8891);              // 开启服务并指定端口
MyAPI.StartServer("127.0.0.1");       // 限定仅本机可访问 【Pro版】
MyAPI.StartServer("127.0.0.1", 8891); // 限定本机访问并指定端口 【Pro版】
MyAPI.StopServer();                   // 停止服务

// 语义化路由注册（v1.7+ 支持）
MyAPI.MapGet("/", Hello);    // 限定 GET
MyAPI.MapPost("/", Hello);   // 限定 POST
MyAPI.MapPut("/", Hello);    // 限定 PUT
MyAPI.MapDelete("/", Hello); // 限定 DELETE
```

```vb [VB.NET]
MyAPI.StartServer()                  ' 开启服务（默认端口 8090）
MyAPI.StartServer(8891)              ' 开启服务并指定端口
MyAPI.StartServer("127.0.0.1")       ' 限定仅本机可访问 【Pro版】
MyAPI.StartServer("127.0.0.1", 8891) ' 限定本机访问并指定端口 【Pro版】
MyAPI.StopServer()                   ' 停止服务

' 语义化路由注册（v1.7+ 支持）
MyAPI.MapGet("/", AddressOf Hello)    ' 限定 GET
MyAPI.MapPost("/", AddressOf Hello)   ' 限定 POST
MyAPI.MapPut("/", AddressOf Hello)    ' 限定 PUT
MyAPI.MapDelete("/", AddressOf Hello) ' 限定 DELETE
```

:::

> 💡 路由的详细用法（精准 / 通配 / RESTful / 特性）、参数解析、静态文件托管、CORS、Cookie 等基础能力，请参阅 [基础能力](/basic)。

---

## 3. 验证运行

编译并运行程序后，在浏览器或 curl 中访问：

```bash
curl http://127.0.0.1:8090
```

返回 `Hello PicoServer` 即表示安装成功。
