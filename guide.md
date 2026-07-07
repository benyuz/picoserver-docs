---
title: 快速入门 - PicoServer
description: PicoServer 快速入门指南，包含安装方法和第一个 Web API 示例
next:
  text: 基础能力
  link: /basic
---

# 💡 快速入门

> 默认监听端口为 `8090`。在 Windows 环境下运行如果绑定失败，请注意赋予应用管理员权限。推荐使用 **PicoServer** 最新版本保障功能完整性。

---

## 1. 安装 PicoServer

在 Visual Studio 的 NuGet 包管理器中搜索 `PicoServer` 并安装，或在项目目录执行：

```bash
dotnet add package PicoServer
```

## 2. 最简 WebAPI

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

```vb
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



## 3. 验证运行

编译并运行程序后，在浏览器或 curl 中访问：

```bash
curl http://127.0.0.1:8090
```

返回 `Hello PicoServer` 即表示安装成功。

---

## 📚 文档导航

- **[基础能力](/basic)** — 路由、参数、响应、静态文件、CORS、Cookie
- **[数据与文件](/data-file)** — 文件上传/下载、流媒体
- **[实时通信](/realtime)** — SSE、长连接、WebSocket
- **[安全与鉴权](/security)** — Token、JWT、黑名单、加密
- **[高级定制](/advanced)** — 自定义中间件、动态路由
- **[扩展包](/extensions)** — 特性路由、AOT兼容性
