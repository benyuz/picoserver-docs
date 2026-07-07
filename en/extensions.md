---
title: Extensions - PicoServer
description: PicoServer.Extensions attribute routing extension package
prev:
  text: Advanced Customization
  link: /en/advanced
next:
  text: Benchmark
  link: /en/benchmark
---

# 📦 Extensions

## PicoServer.Extensions

Attribute routing is provided by [PicoServer.Extensions](https://www.nuget.org/packages/PicoServer.Extensions) package. Install first before use.

### Installation

```bash
dotnet add package PicoServer.Extensions
```

### Attribute Routing

Define routes with attributes for cleaner and more centralized code.

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