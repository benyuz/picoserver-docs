---
title: 扩展包 - PicoServer
description: PicoServer.Extensions 特性路由扩展包使用说明
prev:
  text: 高级定制
  link: /advanced
next:
  text: 性能测试
  link: /benchmark
---

# 📦 扩展包

## PicoServer.Extensions

特性路由功能由 [PicoServer.Extensions](https://www.nuget.org/packages/PicoServer.Extensions) 扩展包提供。使用前请先安装。

### 安装

```bash
dotnet add package PicoServer.Extensions
```

### 特性路由

通过在控制器上打标签实现自动路由扫描，更加直观和集中。

::: code-group

```csharp [C#]
using PicoServer.Extensions;

[ApiController]
public class UserController
{
    [ApiRoute("/api/user", "GET")]
    public async Task GetUser(HttpListenerRequest req, HttpListenerResponse res)
    {
        await res.WriteAsync("{\"id\":1,\"name\":\"张三\"}", WebAPIServer.ContentType.ApplicationJson);
    }

    [ApiRoute("/api/user", "POST")]
    public async Task SaveUser(HttpListenerRequest req, HttpListenerResponse res)
    {
        await res.WriteAsync("{\"code\":1,\"msg\":\"saved\"}", WebAPIServer.ContentType.ApplicationJson);
    }
}

// 在 Main 函数中一键开启自动扫描注册
private static readonly WebAPIServer MyAPI = new WebAPIServer();
MyAPI.AutoRegisterRoutes();
MyAPI.StartServer();
```

```vb [VB.NET]
Imports PicoServer.Extensions

<ApiController>
Public Class UserController
    <ApiRoute("/api/user", "GET")>
    Public Async Function GetUser(req As HttpListenerRequest, res As HttpListenerResponse) As Task
        Await res.WriteAsync("{""id"":1,""name"":""张三""}", WebAPIServer.ContentType.ApplicationJson)
    End Function

    <ApiRoute("/api/user", "POST")>
    Public Async Function SaveUser(req As HttpListenerRequest, res As HttpListenerResponse) As Task
        Await res.WriteAsync("{""code"":1,""msg"":""saved""}", WebAPIServer.ContentType.ApplicationJson)
    End Function
End Class

' 在 Main 函数中一键开启自动扫描注册
Private Shared ReadOnly MyAPI As New WebAPIServer()
MyAPI.AutoRegisterRoutes()
MyAPI.StartServer()
```

:::