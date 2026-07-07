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

使用特性路由可以通过标注特性来定义路由，更加直观和集中。

::: code-group

```csharp [C#]
using PicoServer.Extensions;

[RoutePrefix("/api/user")]
public class UserController
{
    [HttpGet("info")]
    public async Task GetUserInfo(HttpListenerRequest request, HttpListenerResponse response)
    {
        await response.WriteAsync(@"{""code"":1, ""msg"":""success""}");
    }

    [HttpPost("save")]
    public async Task SaveUser(HttpListenerRequest request, HttpListenerResponse response)
    {
        await response.WriteAsync(@"{""code"":1, ""msg"":""saved""}");
    }
}

// 注册特性路由
MyAPI.MapControllers(typeof(UserController));
```

```vb [VB.NET]
Imports PicoServer.Extensions

<RoutePrefix("/api/user")>
Public Class UserController
    <HttpGet("info")>
    Public Async Function GetUserInfo(request As HttpListenerRequest, response As HttpListenerResponse) As Task
        Await response.WriteAsync("{""code"":1, ""msg"":""success""}")
    End Function

    <HttpPost("save")>
    Public Async Function SaveUser(request As HttpListenerRequest, response As HttpListenerResponse) As Task
        Await response.WriteAsync("{""code"":1, ""msg"":""saved""}")
    End Function
End Class

MyAPI.MapControllers(GetType(UserController))
```

:::