---
title: Advanced Customization - PicoServer
description: PicoServer custom middleware, dynamic routing, extension points
prev:
  text: Security & Auth
  link: /en/security
next:
  text: Extensions
  link: /en/extensions
---

# 🔧 Advanced Customization

> PicoServer opens up **middleware** for secondary development, encapsulation, and solution integration.
>
> Use `AddMiddleware()` to develop your own middleware such as parameter routing, rate limiting, blacklist, etc.
>
> **Note: Middleware executes in the order they are added.**

---

## 1. Custom Middleware

### Minimal File Server

A complete file server example combining routes and `SendFileAsync` for browsing, previewing and downloading.

::: code-group

```csharp [C#]
using PicoServer;

var MyAPI = new WebAPIServer();
string rootPath = @"D:\MyFiles";

MyAPI.AddRoute("/files", async (req, resp) => {
    var files = Directory.GetFiles(rootPath).Select(Path.GetFileName);
    var html = "<h1>File List</h1><ul>";
    foreach (var f in files)
        html += $"<li><a href='/view?name={f}'>{f}</a></li>";
    html += "</ul>";
    await resp.WriteAsync(html, WebAPIServer.ContentType.TextHtml);
}, "GET");

MyAPI.AddRoute("/view", (req, resp) => {
    string fileName = req.ParseGetQueryString("name");
    string fullPath = Path.Combine(rootPath, fileName);
    return resp.SendFileAsync(fullPath, asAttachment: false);
}, "GET");

MyAPI.AddRoute("/download", (req, resp) => {
    string fileName = req.ParseGetQueryString("name");
    return resp.SendFileAsync(Path.Combine(rootPath, fileName));
}, "GET");

MyAPI.StartServer(8090);
Console.WriteLine("File server started: http://127.0.0.1:8090");
```

```vb [VB.NET]
Imports PicoServer

Dim MyAPI = New WebAPIServer()
Dim rootPath = "D:\MyFiles"

MyAPI.AddRoute("/files", Async Function(req, resp)
    Dim files = Directory.GetFiles(rootPath).[Select](Function(f) Path.GetFileName(f))
    Dim html = "<h1>File List</h1><ul>"
    For Each f In files
        html += $"<li><a href='/view?name={f}'>{f}</a></li>"
    Next
    html += "</ul>"
    Await resp.WriteAsync(html, WebAPIServer.ContentType.TextHtml)
End Function, "GET")

MyAPI.AddRoute("/view", Function(req, resp)
    Dim fileName = req.ParseGetQueryString("name")
    Dim fullPath = Path.Combine(rootPath, fileName)
    Return resp.SendFileAsync(fullPath, False)
End Function, "GET")

MyAPI.AddRoute("/download", Function(req, resp)
    Dim fileName = req.ParseGetQueryString("name")
    Return resp.SendFileAsync(Path.Combine(rootPath, fileName))
End Function, "GET")

MyAPI.StartServer(8090)
Console.WriteLine("File server started: http://127.0.0.1:8090")
```

:::

---

## 2. Dynamic Route Handler

Implement **dynamic routing** using middleware extension capabilities, completing **path matching**, **method dispatching**, and **request termination** in one logic block.

::: code-group

```csharp [C#]
using PicoServer;
using System.Text.RegularExpressions;

var MyAPI = new WebAPIServer();

MyAPI.AddMiddleware(async (req, resp) => {
    var match = Regex.Match(req.Url.AbsolutePath, @"^/product/(?<id>\d+)$");

    if (match.Success) {
        string id = match.Groups["id"].Value;

        switch (req.HttpMethod) {
            case "GET":
                await resp.WriteAsync($"{{\"action\":\"Query Product\", \"id\":{id}}}");
                break;
            case "POST":
                await resp.WriteAsync($"{{\"action\":\"Update Product\", \"id\":{id}, \"result\":\"Success\"}}");
                break;
            default:
                resp.StatusCode = 405;
                await resp.WriteAsync("{\"msg\":\"Method not supported\"}");
                break;
        }

        return false;
    }

    return true;
});

MyAPI.StartServer(8090);
```

```vb [VB.NET]
Imports PicoServer
Imports System.Text.RegularExpressions

Dim MyAPI = New WebAPIServer()

MyAPI.AddMiddleware(Async Function(req, resp)
    Dim match = Regex.Match(req.Url.AbsolutePath, "^/product/(?<id>\d+)$")

    If match.Success Then
        Dim id = match.Groups("id").Value

        Select Case req.HttpMethod
            Case "GET"
                Await resp.WriteAsync($"{{\"action\":\"Query Product\", \"id\":{id}}}")
            Case "POST"
                Await resp.WriteAsync($"{{\"action\":\"Update Product\", \"id\":{id}, \"result\":\"Success\"}}")
            Case Else
                resp.StatusCode = 405
                Await resp.WriteAsync("{\"msg\":\"Method not supported\"}")
        End Select

        Return False
    End If

    Return True
End Function)

MyAPI.StartServer(8090)
```

:::

---

## 3. Extension Points

### Middleware Registration

```csharp
MyAPI.AddMiddleware(async (req, resp) => {
    // Custom logic
    return true; // Return true to continue, false to terminate
});
```

### Service Events

```csharp
MyAPI.OnServerStarted += () => { Console.WriteLine("Server started"); };
MyAPI.OnServerStopped += () => { Console.WriteLine("Server stopped"); };
```