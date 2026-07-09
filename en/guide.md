---
title: Quick Start - PicoServer
description: PicoServer quick start guide, including installation and first Web API example
next:
  text: Basic Features
  link: /en/basic
---

# 💡 Quick Start

> Default listening port is `8090`. On Windows, if binding fails, make sure to grant the application administrator privileges. It is recommended to use the **latest version** of PicoServer to ensure full functionality.

## 1. Install PicoServer

Search for `PicoServer` in Visual Studio's NuGet Package Manager and install it, or run the following in your project directory:

```bash
dotnet add package PicoServer
```

## 2. Minimal WebAPI

Just three lines of core code to start a lightweight Web service in any .NET application.

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

        Console.WriteLine("Server started: http://127.0.0.1:8090");
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

        Console.WriteLine("Server started: http://127.0.0.1:8090")
        Console.ReadKey()

        MyAPI.StopServer()
    End Sub

    Private Async Function Hello(request As HttpListenerRequest, response As HttpListenerResponse) As Task
        Await response.WriteAsync("Hello PicoServer")
    End Function
End Module
```

:::

## 3. Verify It Works

After building and running the program, access it in your browser or via curl:

```bash
curl http://127.0.0.1:8090
```

A response of `Hello PicoServer` means the installation was successful.

## 📚 Documentation Navigation

- **[Basic Features](/en/basic)** — Routing, Parameters, Response, Static Files, CORS, Cookie
- **[Data & Files](/en/data-file)** — File Upload/Download, Streaming
- **[Real-time Communication](/en/realtime)** — SSE, Long Connection, WebSocket
- **[Security & Auth](/en/security)** — Token, JWT, Blacklist, Encryption
- **[Advanced Customization](/en/advanced)** — Custom Middleware, Dynamic Routing
- **[Extensions](/en/extensions)** — Attribute Routing, AOT Compatibility
