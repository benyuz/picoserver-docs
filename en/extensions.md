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

[ApiController]
public class UserController
{
    [ApiRoute("/api/user", "GET")]
    public async Task GetUser(HttpListenerRequest req, HttpListenerResponse res)
    {
        await res.WriteAsync("{\"id\":1,\"name\":\"Zhang\"}", WebAPIServer.ContentType.ApplicationJson);
    }

    [ApiRoute("/api/user", "POST")]
    public async Task SaveUser(HttpListenerRequest req, HttpListenerResponse res)
    {
        await res.WriteAsync("{\"code\":1,\"msg\":\"saved\"}", WebAPIServer.ContentType.ApplicationJson);
    }
}

// Auto scan and register all attribute routes
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
        Await res.WriteAsync("{""id"":1,""name"":""Zhang""}", WebAPIServer.ContentType.ApplicationJson)
    End Function

    <ApiRoute("/api/user", "POST")>
    Public Async Function SaveUser(req As HttpListenerRequest, res As HttpListenerResponse) As Task
        Await res.WriteAsync("{""code"":1,""msg"":""saved""}", WebAPIServer.ContentType.ApplicationJson)
    End Function
End Class

' Auto scan and register all attribute routes
Private Shared ReadOnly MyAPI As New WebAPIServer()
MyAPI.AutoRegisterRoutes()
MyAPI.StartServer()
```

:::